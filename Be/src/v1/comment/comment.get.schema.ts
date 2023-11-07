import * as Joi from 'joi';
import type { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";

export const commentGetParamsSchema = Joi.object({
  id: Joi.string().required(),
});

export interface CommentGetRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: string;
  }
};
