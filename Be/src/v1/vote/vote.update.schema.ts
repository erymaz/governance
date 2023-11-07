import * as Joi from 'joi';
import type { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";
import { Winner } from '../../types';

export const voteUpdateParamsSchema = Joi.object({
  _id: Joi.string().required(),
});

export const voteUpdateBodySchema = Joi.object({
  winners: Joi.array().required(),
  tokenAmount: Joi.number(),
  timestamp: Joi.number().required(),
});

interface VoteUpdateBodySchema {
  winners: Winner[];
  tokenAmount: number;
  timestamp: number;
}

export interface VoteUpdateRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: VoteUpdateBodySchema;
}
