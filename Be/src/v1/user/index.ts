import * as express from 'express';
import { createValidator } from 'express-joi-validation';

import userGet from './user.get';
import userCreate from './user.create';
import userDelete from './user.delete';
import { userGetParamsSchema } from './user.get.schema';
import { userCreateBodySchema } from './user.create.schema';
import { userDeleteParamsSchema, userDeleteBodySchema } from './user.delete.schema';

const router = express.Router();
const validator = createValidator();

router.get('/:account', validator.params(userGetParamsSchema), userGet);

router.post('/', validator.body(userCreateBodySchema), userCreate);

router.delete('/:account', validator.params(userDeleteParamsSchema), validator.body(userDeleteBodySchema), userDelete);

export default router;
