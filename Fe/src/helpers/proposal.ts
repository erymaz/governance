import { Proposal, ProposalStatus } from '@/types'

export function getProposalStatus(proposal: Proposal, canPass = false): ProposalStatus {
  const now = new Date().getTime() / 1000
  const endTime = proposal.endTime
  if (proposal.approve === ProposalStatus.PENDING) {
    return ProposalStatus.PENDING
  } else if (proposal.approve === ProposalStatus.DECLINED) {
    return ProposalStatus.DECLINED
  } else if (proposal.approve === ProposalStatus.APPROVED && now < endTime ) {
    return ProposalStatus.ACTIVE
  } else if (canPass) {
    return ProposalStatus.CLOSED
  } else {
    return ProposalStatus.EXPIRED
  }
}
