import * as express from 'express';
import { createValidator } from 'express-joi-validation';

import voteGet from './vote.get';
import voteGetAll from './vote.getAll';
import voteCreate from './vote.create';
import voteGetCount from './vote.getCount';
import voteGetPower from './vote.getPower';
import voteUpdate from './vote.update';
import { voteGetAllQuerySchema } from './vote.getAll.schema';
import { voteGetParamsSchema } from './vote.get.schema';
import { voteCreateBodySchema } from './vote.create.schema';
import { voteGetPowerQuerySchema } from './vote.getPower.schema';
import { voteUpdateParamsSchema, voteUpdateBodySchema } from './vote.update.schema';

const router = express.Router();
const validator = createValidator();

router.get('/', validator.query(voteGetAllQuerySchema), voteGetAll);

router.post('/', validator.body(voteCreateBodySchema), voteCreate);

router.get('/count', validator.query(voteGetAllQuerySchema), voteGetCount);

router.get('/votingPower', validator.query(voteGetPowerQuerySchema), voteGetPower);

router.put('/:_id', validator.params(voteUpdateParamsSchema), validator.body(voteUpdateBodySchema), voteUpdate);

// Put at last place
router.get('/:_id', validator.params(voteGetParamsSchema), voteGet);

export default router;
