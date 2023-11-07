import * as Joi from 'joi';
import type { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";

export const voteGetAllQuerySchema = Joi.object({
  proposalId: Joi.string().required(),
  voter: Joi.string(),
  page: Joi.number(),
  pageLength: Joi.number(),
});

export interface VoteGetAllRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    proposalId: string;
    voter: string;
    page: number;
    pageLength: number;
  }
};
