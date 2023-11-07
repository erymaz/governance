import * as express from 'express';
import { createValidator } from 'express-joi-validation';

import aggregationGet from './aggregation.get';
import aggregationGetAll from './aggregation.getAll';
import aggregationCreate from './aggregation.create';
import aggregationDelete from './aggregation.delete';
import { aggregationGetParamsSchema } from './aggregation.get.schema';
import { aggregationGetAllQuerySchema } from './aggregation.getAll.schema';
import { aggregationCreateBodySchema } from './aggregation.create.schema';
import { aggregationDeleteParamsSchema } from './aggregation.delete.schema';

const router = express.Router();
const validator = createValidator();

router.get('/', validator.query(aggregationGetAllQuerySchema), aggregationGetAll);

router.get('/:id', validator.params(aggregationGetParamsSchema), aggregationGet);

router.post('/', validator.body(aggregationCreateBodySchema), aggregationCreate);

router.delete('/:id', validator.params(aggregationDeleteParamsSchema), aggregationDelete);

export default router;
