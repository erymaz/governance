import * as Joi from 'joi';
import type { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";
import { Candidate } from 'src/types';

export const aggregationCreateBodySchema = Joi.object({
  time: Joi.number().required(),
  communityId: Joi.number().required(),
  proposalId: Joi.string().required(),
  result: Joi.array().required(),
  tokenAmount: Joi.number().required(),
});

interface AggregationCreateBodySchema {
  time: number;
  communityId: number;
  proposalId: string;
  result: Candidate[];
  tokenAmount: number;
}

export interface AggregationCreateRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: AggregationCreateBodySchema;
}
