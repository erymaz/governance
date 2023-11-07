import * as Joi from 'joi';
import type { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";

export const aggregationDeleteParamsSchema = Joi.object({
  id: Joi.string().required(),
});

export interface AggregationDeleteRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: string;
  }
}
