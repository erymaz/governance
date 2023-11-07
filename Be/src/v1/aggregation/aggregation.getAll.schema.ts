import * as Joi from 'joi';
import type { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";

export const aggregationGetAllQuerySchema = Joi.object({
  proposalId: Joi.string(),
  page: Joi.number(),
  pageLength: Joi.number(),
});

export interface AggregationGetAllRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    proposalId: string;
    page: number;
    pageLength: number;
  }
};
