import { parentPort } from 'worker_threads';
import { Community, Winner } from "../types";
import { getCommunities, getVotes } from "../services/proton.service";
import { Proposal } from "../v1/proposal/proposal.model";
import { Vote } from "../v1/vote/vote.model";
import { Aggregation } from "../v1/aggregation/aggregation.model";
import strategies from '../strategies';
import { ProposalStatus } from '../types'
import constants from "../constants";
import connectToMongoDB from "../services/mongo.service";
import { BalanceHolder } from "../types";

connectToMongoDB();

parentPort!.on('message', async (data) => {
  await updateVotePower();
})

const { CHAIN } = constants;

const updateVotePower = async () => {
  const startTime = new Date().getTime();

  try {
    // Fetch all communities
    const communities = await getCommunities();

    // Get all active proposals in community
    const proposalQueries = communities.map((_: Community) => Proposal.find({
      communityId: _.id,
      startTime: {'$lt': startTime/1000},
      endTime: {'$gte': startTime/1000},
      confirmed: true,
      approve: ProposalStatus.APPROVED,
    }));
    const communitiesProposals = await Promise.all(proposalQueries);

    let aggregationSaveQueries: any[] = [];
    const balancesMap: Record<string, {
      balances: BalanceHolder,
      supply: number,
    }> = {};

    // Loop each community
    for (const proposals of communitiesProposals) {
      if (!proposals.length) {
        continue;
      }

      const communityId = proposals[0].communityId;
      // Get all votes in proposal
      const votesQueries = proposals.map(_ => Vote.find({proposalId: _._id}));
      const votesFromSCQueries = proposals.map(_ => getVotes(_.sid));
      const proposalsVotes = await Promise.all(votesQueries);
      const proposalsVotesFromSC = await Promise.all(votesFromSCQueries);
      let proposalUpdateQueries: any[] = [];

      // Loop each proposal
      for (const votesFromSC of proposalsVotesFromSC) {
        if (!votesFromSC.length) {
          continue;
        }
        const proposalIdSC = votesFromSC[0].proposalId;
        const proposal = proposals.find(_ => _.sid == proposalIdSC);
        if (!proposal) {
          continue;
        }

        // Votes from mongo
        const votes = proposalsVotes.find(_ => _.length && _[0].proposalId == proposal._id);

        // get all governance token holders and total supply from strategy
        const strategy = strategies[proposal.strategy].strategy;
        if (!balancesMap[proposal.strategy]) {
          const [balances, supply] = await Promise.all([
            strategy(CHAIN),
            strategies[proposal.strategy].supply(),
          ]);
          balancesMap[proposal.strategy] = {
            balances,
            supply,
          };
        }

        // Update voting power of winner
        const candidates = proposal.candidates.map(_ => ({
          ..._,
          tokenAmount: 0,
        }));
        let voteUpdateQueries: any[] = [];
        let totalTokenAmount = 0;
        votesFromSC.forEach(voteFromSC => {
          const vote = votes?.find(_ => _.voter == voteFromSC.voter);
          if (!vote) {
            // Case: vote exists in SC but not saved in mongodb
            const amount = balancesMap[proposal.strategy]?.balances[voteFromSC.voter]?.amount || 0;
            const winners = voteFromSC.winners.map((winner: Winner) => {
              const tokenAmount = amount * winner.weight / 100;
              const candidate = candidates.find(cd => cd.id == winner.id);
              if (candidate) {
                candidate.tokenAmount += tokenAmount;
              }
              return {
                ...winner,
                tokenAmount,
              };
            });

            // Store in mongodb
            voteUpdateQueries.push({
              insertOne: {
                document: {
                  voter: voteFromSC.voter,
                  communityId: voteFromSC.communityId,
                  proposalId: proposal._id,
                  winners,
                  tokenAmount: amount,
                  timestamp: voteFromSC.timestamp,
                }
              }
            });

            totalTokenAmount += amount;
          } else {
            // Case: vote exists both SC and mongodb
            const amount = balancesMap[proposal.strategy]?.balances[vote.voter]?.amount || 0;

            // Update token amount of winners
            const winners = voteFromSC.winners.map((winner: Winner) => {
              const tokenAmount = amount * winner.weight / 100;
              const candidate = candidates.find(cd => cd.id === winner.id);
              if (candidate) {
                candidate.tokenAmount += tokenAmount;
              }
              return {
                ...winner,
                tokenAmount,
              };
            });

            voteUpdateQueries.push({
              updateOne: {
                filter: {_id: vote._id},
                update: {
                  winners,
                  tokenAmount:amount,
                },
              }
            });

            totalTokenAmount += amount;
          }
        });

        // Update quorum and total token amount voted on
        const _supply = balancesMap[proposal.strategy].supply || 1;
        proposalUpdateQueries.push({
          updateOne: {
            filter: {_id: proposal._id},
            update: {
              candidates,
              tokenAmount: totalTokenAmount,
              quorum: Number((totalTokenAmount * 100 / _supply).toFixed(2)),
            },
          }
        });

        if (voteUpdateQueries.length) {
          await Vote.bulkWrite(voteUpdateQueries);
        }

        // Save current voting result for history
        const aggregation = new Aggregation({
          time: Math.round(startTime / 1000),
          communityId,
          proposalId: proposalIdSC,
          result: candidates,
          tokenAmount: totalTokenAmount,
        });
        aggregationSaveQueries.push(aggregation);
      }

      if (proposalUpdateQueries.length) {
        await Proposal.bulkWrite(proposalUpdateQueries);
      }
    }

    if (aggregationSaveQueries.length) {
      await Aggregation.bulkSave(aggregationSaveQueries);
    }

    const endTime = new Date().getTime();
    console.log("Elapsed Time(voting power): ", endTime-startTime);
  } catch(err) {
    console.log("schedule err: ", err);
  }
};
