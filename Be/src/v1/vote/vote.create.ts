import type { Request, Response } from "express";
import { Vote, VoteInput } from "./vote.model";
import { Proposal } from "../proposal/proposal.model";
import { Winner } from "../../types";

export default async(
  req: Request,
  res: Response,
): Promise<Response> => {
  const { voter, communityId, proposalId, winners, tokenAmount, timestamp } = req.body;

  // Check already voted
  const vote = await Vote.findOne({
    voter,
    communityId,
    proposalId
  })

  if (vote) {
    vote.winners = winners;
    vote.tokenAmount = tokenAmount;
    vote.timestamp = timestamp;
    await vote.save();
    return res.status(200).json(vote);
  }

  const voteInput: VoteInput = {
    voter,
    communityId,
    proposalId,
    winners,
    tokenAmount: tokenAmount || 0,
    timestamp,
  };

  try {
    const voteCreated = await Vote.create(voteInput);

    // update voting power aggregation
    const proposal = await Proposal.findById(proposalId);
    if (!proposal) {
      return res.status(400).json({success: false, message: `Can not find proposal: ${proposalId}`});
    }

    const candidates = proposal.candidates.map(cd => {
      const winner = (winners as Winner[]).find(_ => _.id == cd.id);
      return {
        ...cd,
        tokenAmount: cd.tokenAmount + (winner?.tokenAmount || 0)
      }
    });
    proposal.candidates = candidates;
    proposal.tokenAmount += tokenAmount || 0;
    await proposal.save();

    return res.status(201).json(voteCreated);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err)
  }
}
