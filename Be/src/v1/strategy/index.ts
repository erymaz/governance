import * as express from 'express';
import { createValidator } from 'express-joi-validation';

import strategyGet from './strategy.get';
import strategyGetAll from './strategy.getAll';
import { strategyGetAllQuerySchema } from './strategy.getAll.schema';
import { strategyGetParamsSchema } from './strategy.get.schema';

const router = express.Router();
const validator = createValidator();

router.get('/', validator.query(strategyGetAllQuerySchema), strategyGetAll);

router.get('/:name', validator.params(strategyGetParamsSchema), strategyGet);

export default router;
