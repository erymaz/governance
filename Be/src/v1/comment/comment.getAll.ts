import type { Request, Response } from 'express';
import { Comment } from './comment.model';

export default async function (
  req: Request,
  res: Response
): Promise<Response> {
  const { proposalId } = req.query;
  const page = req.query.page ? +req.query.page : 1;
  const pageLength = req.query.pageLength ? +req.query.pageLength : 10;
  const start = (page - 1) * pageLength;

  const comments = await Comment
    .find({proposalId})
    .sort({createdAt: 1})
    .skip(start)
    .limit(pageLength);

  return res.status(200).json(comments);
};
