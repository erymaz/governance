import type { Request, Response } from 'express';
import { Vote } from './vote.model';

export default async function (
  req: Request,
  res: Response
): Promise<Response> {
  const { proposalId } = req.query;
  const count = await Vote.find({proposalId}).count();
  return res.status(200).json(count);
};
