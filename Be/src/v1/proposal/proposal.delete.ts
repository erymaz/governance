import type { Request, Response } from 'express';
import { Proposal } from './proposal.model';

export default async function (
  req: Request,
  res: Response
): Promise<Response> {
  const { _id } = req.params;
  await Proposal.findByIdAndDelete(_id);
  return res.status(200).json({success: true});
};
