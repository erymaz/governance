import * as Joi from 'joi';
import type { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";

export const communityCreateBodySchema = Joi.object({
  sid: Joi.number().required(),
  guideline: Joi.string(),
  admin: Joi.string().required(),
});

interface CommunityCreateBodySchema {
  sid: number;
  guideline: string;
  admin: string;
}

export interface CommunityCreateRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: CommunityCreateBodySchema;
}
