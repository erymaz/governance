import type { Request, Response } from 'express';
import strategies from '../../strategies';

export default async function (
  req: Request,
  res: Response
): Promise<Response> {
  return res.status(200).json(strategies);
};
