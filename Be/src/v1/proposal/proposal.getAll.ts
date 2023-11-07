import type { Request, Response } from 'express';
import { Proposal } from './proposal.model';
import { ProposalStatus } from '../../types'
import { getCommunity } from '../../services/proton.service';

export default async function (
  req: Request,
  res: Response
): Promise<Response> {
  const { communityId, status } = req.query;
  const page = req.query.page ? +req.query.page : 1;
  const pageLength = req.query.pageLength ? +req.query.pageLength : 5;
  const start = (page - 1) * pageLength;
  const now = new Date().getTime() / 1000

  let community = null;
  if (status == ProposalStatus.CLOSED || status == ProposalStatus.EXPIRED) {
    community = await getCommunity(+communityId!);
    if (!community) {
      return res.status(400).json({success: false, message: 'Can\'t find community'});
    }
  }

  const quorum = community ? community.quorum/100 : 0;
  const where = {
    communityId,
    confirmed: true,
    ...(status == ProposalStatus.ACTIVE ? {approve: ProposalStatus.APPROVED, endTime: {'$gt': now}} :
        status == ProposalStatus.PENDING ? {approve: ProposalStatus.PENDING} :
        status == ProposalStatus.DECLINED ? {approve: ProposalStatus.DECLINED} :
        status == ProposalStatus.EXPIRED ? {approve: ProposalStatus.APPROVED, endTime: {'$lt': now}, quorum: {'$lt': quorum}} :
        status == ProposalStatus.CLOSED ? {approve: ProposalStatus.APPROVED, endTime: {'$lt': now}, quorum: {'$gte': quorum}} : {}),
  }

  const proposals = await Proposal
    .find({...where})
    .sort({
      tokenAmount: -1,
      createdAt: -1,
    })
    .skip(start)
    .limit(pageLength);

  return res.status(200).json(proposals);
};
