import type { Request, Response } from "express";
import { Vote } from "./vote.model";

export default async(
  req: Request,
  res: Response,
): Promise<Response> => {
  const { _id } = req.params;
  const { winners, tokenAmount, timestamp } = req.body;

  try {
    const vote = await Vote.findById(_id);
    if (!vote) {
      return res.status(400).json({
        success: false,
        message: 'Can\'t find your vote',
      });
    }

    vote.winners = winners;
    vote.tokenAmount = tokenAmount;
    vote.timestamp = timestamp;
    await vote.save()

    const voteUpdated = await Vote.findById(_id);
    return res.status(201).json(voteUpdated);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err)
  }
}
