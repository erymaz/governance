import * as Joi from 'joi';
import type { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";

export const proposalDeleteParamsSchema = Joi.object({
  _id: Joi.string().required(),
});

export interface ProposalDeleteRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    _id: string;
  }
};
