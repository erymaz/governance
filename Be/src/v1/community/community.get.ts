import type { Request, Response } from 'express';
import { getCommunity } from '../../services/proton.service';
import { User } from '../user/user.model';
import { Community } from './community.model';

export default async function (
  req: Request,
  res: Response
): Promise<Response> {
  const { id } = req.params;
  const community = await getCommunity(+id);

  if (community) {
    community.memberCount = await User.count({ communities: community.id });
    const _comm = await Community.findOne({ sid: +id });
    if (_comm) {
      community.guideline = _comm.guideline;
    }
  }

  return res.status(200).json(community || {});
};
