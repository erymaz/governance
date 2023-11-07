import * as Joi from 'joi';
import type { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";

export const strategyGetParamsSchema = Joi.object({
  name: Joi.string().required(),
});

export interface StrategyGetRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    name: string;
  }
};
