import * as Joi from 'joi';
import type { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";

export const aggregationGetParamsSchema = Joi.object({
  id: Joi.string().required(),
});

export interface AggregationGetRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: string;
  }
};
