import * as Joi from 'joi';
import type { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";

export const commentGetAllQuerySchema = Joi.object({
  proposalId: Joi.string().required(),
  page: Joi.number(),
  pageLength: Joi.number(),
});

export interface CommentGetAllRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    proposalId: string;
    page: number;
    pageLength: number;
  }
};
