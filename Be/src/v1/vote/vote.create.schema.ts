import * as Joi from 'joi';
import type { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";
import { Winner } from '../../types';

export const voteCreateBodySchema = Joi.object({
  voter: Joi.string().required(),
  communityId: Joi.number().required(),
  proposalId: Joi.string().required(),
  winners: Joi.array().required(),
  tokenAmount: Joi.number(),
  timestamp: Joi.number().required(),
});

interface VoteCreateBodySchema {
  voter: string;
  communityId: number;
  proposalId: string;
  winners: Winner[];
  tokenAmount: number;
  timestamp: number;
}

export interface VoteCreateRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: VoteCreateBodySchema;
}
