import * as Joi from 'joi';
import type { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";

export const commentGetParamsSchema = Joi.object({
});

export interface CommentGetRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {}
};
