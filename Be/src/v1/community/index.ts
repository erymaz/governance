import * as express from 'express';
import { createValidator } from 'express-joi-validation';

import communityGetAll from './community.getAll';
import communityGet from './community.get';
import { communityGetParamsSchema } from './community.get.schema';
import communityCreate from './community.create';
// import { communityCreateBodySchema } from './community.create.schema';

const router = express.Router();
const validator = createValidator();

router.get('/', communityGetAll);

router.post('/', communityCreate);

router.get('/:id', validator.params(communityGetParamsSchema), communityGet);

export default router;
