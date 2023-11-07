import * as Joi from 'joi';
import type { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";

export const strategyGetAllQuerySchema = Joi.object({
  // communityId: Joi.number().required(),
});

export interface StrategyGetAllRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    // communityId: number;
  }
};
