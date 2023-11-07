import type { Request, Response } from 'express';
import { Comment } from './comment.model';

export default async function (
  req: Request,
  res: Response
): Promise<Response> {
  const { id } = req.params;

  const comment = await Comment.findById(id);

  return res.status(200).json(comment);
};
