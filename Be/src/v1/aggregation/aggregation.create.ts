import type { Request, Response } from "express";
import { Aggregation, AggregationInput } from "./aggregation.model";

export default async(
  req: Request,
  res: Response,
): Promise<Response> => {
  const { time, communityId, proposalId, result, tokenAmount } = req.body;
  const aggregationInput: AggregationInput = {
    time,
    communityId,
    proposalId,
    result,
    tokenAmount,
  };
  const aggregation = await Aggregation.create(aggregationInput);
  return res.status(201).json(aggregation);
}
