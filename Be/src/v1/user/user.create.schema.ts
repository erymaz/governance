import * as Joi from 'joi';
import type { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";

export const userCreateBodySchema = Joi.object({
  account: Joi.string().required(),
  communityId: Joi.number().required(),
});

interface UserCreateBodySchema {
  account: string;
  communityId: number;
}

export interface UserCreateRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: UserCreateBodySchema;
}
