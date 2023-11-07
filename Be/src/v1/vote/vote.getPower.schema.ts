import * as Joi from 'joi';
import type { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";

export const voteGetPowerQuerySchema = Joi.object({
  voter: Joi.string().required(),
  strategy: Joi.string().required(),
});

export interface VoteGetPowerRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    voter: string;
    strategy: string;
  }
};
