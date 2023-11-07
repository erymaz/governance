import { parentPort } from 'worker_threads';
import { getProposals } from "../services/proton.service";
import { Proposal } from "../v1/proposal/proposal.model";
import { Proposal as ScProposal } from "../types";
import connectToMongoDB from "../services/mongo.service";

connectToMongoDB();

parentPort!.on('message', async (data) => {
  await checkUnConfirmedProposals();
  // await checkPendingProposals();
})

const checkUnConfirmedProposals = async () => {
  const proposals = await Proposal.find({confirmed: false});
  if (!proposals?.length) {
    return;
  }
  let communityIds: number[] = [];
  for (const proposal of proposals) {
    if (!communityIds.includes(proposal.communityId)) {
      communityIds.push(proposal.communityId)
    }
  }
  const scProposalQueries = communityIds.map(_ => getProposals(_));
  const scCommunitiesProposals = await Promise.all(scProposalQueries);
  const scProposalsMap: Record<string, ScProposal> = {};
  for (const scProposals of scCommunitiesProposals) {
    for (const scProposal of scProposals) {
      scProposalsMap[scProposal.content] = scProposal;
    }
  }

  let proposalUpdateQueries: any[] = [];
  for (const proposal of proposals) {
    const scProposal = scProposalsMap[proposal._id];
    if (scProposal) {
      proposalUpdateQueries.push({
        updateOne: {
          filter: {_id: proposal._id},
          update: {
            sid: scProposal.id,
            confirmed: true,
          },
        }
      });
    } else {
      // Todo: Remove unconfirmed proposals if they are older than one day.
    }
  }

  if (proposalUpdateQueries.length) {
    await Proposal.bulkWrite(proposalUpdateQueries);
  }
};

// const checkPendingProposals = async () => {
//   const proposals = await Proposal.find({
//     confirmed: true,
//     approve: 'Pending'
//   });
//   if (!proposals?.length) {
//     return;
//   }

//   let proposalIds: number[] = proposals.map(_ => _.sid);

//   console.log('pending proposals: ', proposalIds);
//   const scProposalQueries = proposalIds.map(_ => getProposal(_));
//   const scProposals = await Promise.all(scProposalQueries);

//   let proposalUpdateQueries: any[] = [];
//   for (const proposal of proposals) {
//     const scProposal = scProposals.find(_ => _?.content == proposal._id);
//     if (scProposal && scProposal.approve == 'Approved') {
//       proposalUpdateQueries.push({
//         updateOne: {
//           filter: {_id: proposal._id},
//           update: {
//             approve: 'Approved',
//           },
//         }
//       });
//     }
//   }

//   if (proposalUpdateQueries.length) {
//     await Proposal.bulkWrite(proposalUpdateQueries);
//   }
// };
