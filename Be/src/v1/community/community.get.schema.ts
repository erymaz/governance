import * as Joi from 'joi';
import type { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";

export const communityGetParamsSchema = Joi.object({
  id: Joi.number().required(),
});

export interface CommunityGetRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: number;
  }
};
