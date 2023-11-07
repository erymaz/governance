import * as Joi from 'joi';
import type { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";

export const voteGetParamsSchema = Joi.object({
  _id: Joi.string().required(),
});

export interface VoteGetRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    _id: string;
  }
};
