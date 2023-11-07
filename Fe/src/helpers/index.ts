import { displayNumberAsAmount } from '@bloks/numbers'
import { VotingSystem, votingSystemId, Socials } from '@/types'

export const votingSystems: VotingSystem[] = [
  {
    id: votingSystemId.SINGLE_CHOICE_VOTING,
    name: 'Single Choice Voting',
    active: true,
  },
  {
    id: votingSystemId.APPROVAL_VOTING,
    name: 'Approval Voting',
    active: true,
  },
  {
    id: votingSystemId.WEIGHTED_VOTING,
    name: 'Weighted Voting',
    active: true,
  },
  {
    id: votingSystemId.QUADRATIC_VOTING,
    name: 'Quadratic Voting',
    active: false,
  },
  {
    id: votingSystemId.RANKED_CHOICE_VOTING,
    name: 'Ranked Choice Voting',
    active: false,
  },
  {
    id: votingSystemId.BASIC_VOTING,
    name: 'Basic Voting',
    active: true,
  },
]

export const socials: Record<string, Socials> =  {
  XPR: {
    link: 'https://xprnetwork.org/',
    github: 'https://github.com/protonprotocol/',
    twitter: 'https://twitter.com/ProtonXPR/',
  },
  METAL: {
    link: 'https://metalpay.com/',
    github: 'https://github.com/MetalPay/',
    twitter: 'https://twitter.com/metalpaysme/',
  },
  LOAN: {
    link: 'https://protonloan.com/',
    github: 'https://github.com/protonprotocol/',
    twitter: 'https://twitter.com/ProtonLoan/',
  },
}

export const shortAmountStr = (amount: number): string => {
  if (amount > 1000000000) {
    const share = amount / 1000000000
    return `${displayNumberAsAmount(share, 2, true)}B`
  } else if (amount > 1000000) {
    const share = amount / 1000000
    return `${displayNumberAsAmount(share, 2, true)}M`
  } else if (amount > 1000) {
    const share = amount / 1000
    return `${displayNumberAsAmount(share, 2, true)}K`
  } else {
    return `${displayNumberAsAmount(amount, 2, true)}`
  }
}
