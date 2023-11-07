import * as express from 'express';
import { createValidator } from 'express-joi-validation';

import commentGet from './comment.get';
import commentCreate from './comment.create';
import commentGetAll from './comment.getAll';
import { commentGetParamsSchema } from './comment.get.schema';
import { commentCreateBodySchema } from './comment.create.schema';
import { commentGetAllQuerySchema } from './comment.getAll.schema';

const router = express.Router();
const validator = createValidator();

router.get('/', validator.query(commentGetAllQuerySchema), commentGetAll);

router.get('/:id', validator.params(commentGetParamsSchema), commentGet);

router.post('/', validator.body(commentCreateBodySchema), commentCreate);

export default router;
