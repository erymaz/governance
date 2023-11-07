import * as Joi from 'joi';
import type { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";

export const commentCreateBodySchema = Joi.object({
  author: Joi.string().required(),
  content: Joi.string().required(),
  communityId: Joi.number().required(),
  proposalId: Joi.string().required(),
});

interface CommentCreateBodySchema {
  author: string;
  content: string;
  communityId: number;
  proposalId: string;
}

export interface CommentCreateRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: CommentCreateBodySchema;
}
