import type { Request, Response } from 'express';
import strategies from '../../strategies';
import constants from "../../constants";

const { CHAIN } = constants;

export default async function (
  req: Request,
  res: Response
): Promise<Response> {
  const { voter, strategy } = req.query;
  if (!voter || !strategy) {
    return res.status(200).json(0);
  }

  const fnStrategy = strategies[strategy as string].strategy;
  const balances = await fnStrategy(CHAIN);
  const amount = balances[voter as string]?.amount || 0;
  return res.status(200).json(amount);
};
