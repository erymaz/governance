import type { Request, Response } from "express";
import { Proposal, ProposalInput } from "./proposal.model";

export default async(
  req: Request,
  res: Response,
): Promise<Response> => {
  const { author, communityId, title, description, discussion, strategy, votingSystem, candidates, startTime, endTime, confirmed, approve } = req.body;

  const proposalInput: ProposalInput = {
    sid: -1,
    author,
    communityId,
    title,
    description,
    discussion,
    strategy,
    votingSystem,
    candidates,
    tokenAmount: 0,
    quorum: 0,
    startTime,
    endTime,
    confirmed,
    approve,
  };

  const proposalCreated = await Proposal.create(proposalInput);
  return res.status(201).json(proposalCreated);
}
