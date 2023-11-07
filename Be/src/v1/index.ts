import * as express from 'express';
import community from './community';
import user from './user';
import proposal from './proposal';
import vote from './vote';
import comment from './comment';
import strategy from './strategy';

const router = express.Router()

router.use('/communities', community);

router.use('/users', user);

router.use('/proposals', proposal);

router.use('/votes', vote);

router.use('/comments', comment);

router.use('/strategies', strategy);

export default router;
