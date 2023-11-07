import * as Joi from 'joi';
import type { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";
import { Candidate } from '../../types';

export const proposalCreateBodySchema = Joi.object({
  author: Joi.string().required(),
  communityId: Joi.number().required(),
  title: Joi.string().required(),
  description: Joi.string(),
  discussion: Joi.string(),
  strategy: Joi.string().required(),
  votingSystem: Joi.string().required(),
  candidates: Joi.array().required(),
  startTime: Joi.number().required(),
  endTime: Joi.number().required(),
  confirmed: Joi.boolean(),
  approve: Joi.string(),
});

interface ProposalCreateBodySchema {
  author: string;
  communityId: number;
  title: string;
  description: string;
  discussion: string;
  strategy: string;
  votingSystem: string;
  candidates: Candidate[];
  startTime: number;
  endTime: number;
}

export interface ProposalCreateRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: ProposalCreateBodySchema;
}
