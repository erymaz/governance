import * as express from 'express';
import { createValidator } from 'express-joi-validation';

import proposalGet from './proposal.get';
import proposalUpdate from './proposal.update';
import proposalGetAll from './proposal.getAll';
import proposalCreate from './proposal.create';
import proposalDelete from './proposal.delete';
import { proposalGetParamsSchema } from './proposal.get.schema';
import { proposalUpdateParamsSchema } from './proposal.update.schema';
import { proposalGetAllQuerySchema } from './proposal.getAll.schema';
// import { proposalCreateBodySchema } from './proposal.create.schema';
import { proposalDeleteParamsSchema } from './proposal.delete.schema';

const router = express.Router();
const validator = createValidator();

router.get('/', validator.query(proposalGetAllQuerySchema), proposalGetAll);

router.get('/:_id', validator.params(proposalGetParamsSchema), proposalGet);

router.post('/', proposalCreate);

router.put('/:_id', validator.params(proposalUpdateParamsSchema), proposalUpdate);

router.delete('/:_id', validator.params(proposalDeleteParamsSchema), proposalDelete);

export default router;
