import type { Request, Response } from 'express';
import { Proposal } from './proposal.model';

export default async function (
  req: Request,
  res: Response
): Promise<Response> {
  const { _id } = req.params;
  const proposal = await Proposal.findById(_id)

  return res.status(200).json(proposal || {});
};
