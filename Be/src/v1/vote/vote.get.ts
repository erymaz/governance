import type { Request, Response } from 'express';
import { Vote } from './vote.model';

export default async function (
  req: Request,
  res: Response
): Promise<Response> {
  const { _id } = req.params;
  const vote = Vote.findById(_id);

  return res.status(200).json(vote || {});
};
