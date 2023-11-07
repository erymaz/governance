import type { Request, Response } from 'express';
import { getCommunities } from '../../services/proton.service';
import { User } from '../user/user.model';
import { Community } from './community.model';

export default async function (
  req: Request,
  res: Response
): Promise<Response> {
  const communities = await getCommunities();

  const communitiesMemberCountQueries = communities.map(_ => User.count({ communities: _.id }));
  const communitiesMemberCount = await Promise.all(communitiesMemberCountQueries);

  const communitiesGuidelineQueries = communities.map(_ => Community.findOne({ sid: _.id }));
  const communitiesGuideline = await Promise.all(communitiesGuidelineQueries);

  for (let i=0; i<communities.length; i++) {
    communities[i].memberCount = communitiesMemberCount[i];
    if (communitiesGuideline[i]) {
      communities[i].guideline = communitiesGuideline[i]?.guideline;
    }
  }

  return res.status(200).json(communities);
};
