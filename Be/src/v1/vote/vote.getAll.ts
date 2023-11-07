import type { Request, Response } from 'express';
import { Vote } from './vote.model';

export default async function (
  req: Request,
  res: Response
): Promise<Response> {
  const { proposalId, voter } = req.query;
  const page = req.query.page ? +req.query.page : 1;
  const pageLength = req.query.pageLength ? +req.query.pageLength : 10;
  const start = (page - 1) * pageLength;

  let votes
  let total = 1;
  if (!voter) {
    votes = await Vote
      .find({
        proposalId,
      })
      .sort({tokenAmount: -1})
      .skip(start)
      .limit(pageLength);
    
    total = await Vote.find({
      proposalId,
    }).count();
  } else {
    votes = await Vote.find({
      proposalId,
      voter
    });
  }

  return res.status(200).json({
    list: votes,
    total,
  });
};
