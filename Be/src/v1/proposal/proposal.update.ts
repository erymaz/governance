import type { Request, Response } from "express";
import { Proposal } from "./proposal.model";
import { getProposals } from "../../services/proton.service";

export default async(
  req: Request,
  res: Response,
): Promise<Response> => {
  const { _id } = req.params;
  const { confirmed, approve, endTime } = req.body;

  const proposal = await Proposal.findById(_id);
  if (proposal) {
    if (confirmed) {
      // Fetch from sc
      const proposals = await getProposals(proposal.communityId);
      if (proposals && proposals.length) {
        const pp = proposals.find(_ => _.content == _id);
        if (pp) {
          proposal.sid = pp.id;
          proposal.confirmed = confirmed;
        }
      }
    }
    if (approve) {
      proposal.approve = approve;
    }
    if (endTime) {
      proposal.endTime = endTime;
    }
    await proposal.save();
  }
  return res.status(201).json(proposal || {});
}
