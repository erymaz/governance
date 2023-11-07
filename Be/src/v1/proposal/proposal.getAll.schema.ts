import * as Joi from 'joi';
import type { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";

export const proposalGetAllQuerySchema = Joi.object({
  communityId: Joi.number().required(),
  page: Joi.number(),
  pageLength: Joi.number(),
  status: Joi.string(),
});

export interface ProposalGetAllRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    communityId: number;
    page: number;
    pageLength: number;
    status: string;
  }
};
