import type { Request, Response } from "express";
import { Comment, CommentInput } from "./comment.model";

export default async(
  req: Request,
  res: Response,
): Promise<Response> => {
  const { author, content, communityId, proposalId } = req.body;

  if (!author || !content || !proposalId || communityId < 0) {
    return res.status(422).json({
      message: 'The author name, content and proposal id are required',
    });
  }

  const commentInput: CommentInput = {
    author,
    content,
    communityId,
    proposalId,
  };

  const commentCreated = await Comment.create(commentInput);

  return res.status(201).json(commentCreated);
}
