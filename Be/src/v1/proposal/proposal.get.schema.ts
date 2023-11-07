import * as Joi from 'joi';
import type { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";

export const proposalGetParamsSchema = Joi.object({
  _id: Joi.string().required(),
});

export interface ProposalGetRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    _id: string;
  }
};
