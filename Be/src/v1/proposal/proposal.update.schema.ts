import * as Joi from 'joi';
import type { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";

export const proposalUpdateBodySchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  discussion: Joi.string(),
  startTime: Joi.number(),
  endTime: Joi.number(),
  confirmed: Joi.boolean(),
  approve: Joi.string(),
});

export const proposalUpdateParamsSchema = Joi.object({
  _id: Joi.string().required(),
});

interface ProposalUpdateBodySchema {
  title: string;
  description: string;
  discussion: string;
  startTime: number;
  endTime: number;
  confirmed: boolean;
  approve: string;
}

export interface ProposalUpdateRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: ProposalUpdateBodySchema,
  [ContainerTypes.Params]: {
    _id: string;
  },
}
