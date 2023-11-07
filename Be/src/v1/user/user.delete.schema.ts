import * as Joi from 'joi';
import type { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";

export const userDeleteParamsSchema = Joi.object({
  account: Joi.string().required(),
});

export const userDeleteBodySchema = Joi.object({
  communityId: Joi.number().required(),
});

interface UserDeleteBodySchema {
  communityId: number;
}

export interface UserDeleteRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: UserDeleteBodySchema;
}
