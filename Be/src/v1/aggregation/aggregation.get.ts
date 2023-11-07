import type { Request, Response } from 'express';
import { Aggregation } from './aggregation.model';

export default async function (
  req: Request,
  res: Response
): Promise<Response> {
  const { id } = req.params;
  const aggregation = await Aggregation.findById(id);
  return res.status(200).json(aggregation || {});
};
