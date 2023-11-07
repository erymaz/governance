export interface Community {
  id: number;
  controller: string;
  name: string;
  description: string;
  iconUrl: string;
  website: string;
  strategies: string[];
  votingSystems: string[];
  approvingProposal: boolean;
  proposalFee: {
    quantity: string,
    contract: string,
  };
  minProposalTime: number;
  admins: string[];
  quorum: number;
  memberCount?: number;
  guideline?: string;
}

export interface Candidate {
  id: number;
  name: string;
  tokenAmount?: number;
}

export interface Winner {
  id: number;
  weight: number;
  tokenAmount?: number;
}

export enum votingSystemId {
  SINGLE_CHOICE_VOTING = '0',
  APPROVAL_VOTING = '1',
  WEIGHTED_VOTING = '2',
  QUADRATIC_VOTING = '3',
  RANKED_CHOICE_VOTING = '4',
  BASIC_VOTING = '5',
}

export interface VotingSystem {
  id: votingSystemId,
  name: string,
  active: boolean,
}

export enum ProposalStatus {
  PENDING = 'Pending',
  ACTIVE = 'Active',
  EXPIRED = 'Expired',
  CLOSED = 'Closed',
  APPROVED = 'Approved',
  DECLINED = 'Declined',
}

export interface Proposal {
  _id?: string;          // proposal content id (mongo)
  sid?: number;           // proposal id in sc
  author: string;
  communityId: number;
  title: string;
  description: string;
  discussion: string;
  strategy: string;
  votingSystem: votingSystemId;
  candidates: Candidate[];
  tokenAmount: number;
  quorum?: number;
  startTime: number;
  endTime: number;
  confirmed: boolean;
  approve: ProposalStatus;
}

export type ProposalFilters = ProposalStatus | 'All'

export interface Comment {
  _id?: string;
  author: string;
  content: string;
  communityId: number;
  proposalId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Vote {
  _id?: string;
  id?: number;
  voter: string;
  communityId: number;
  proposalId: string;
  winners: Winner[];
  tokenAmount: number;
  timestamp: number;
}

export interface User {
  _id: string;
  account: string;
  communities: number[];
  createdAt: string;
  updatedAt: string;
}

export interface Token {
  currency: string;
  amount: number;
  contract: string;
  decimals: number;
}

export type Strategies = Record<string, any>

export interface Strategy {
  about: string;
  author: string;
  version: string;
  tokens: Token[];
}

export interface PaginationData {
  list: any[];
  total: number;
}

export interface Socials {
  link: string;
  github: string;
  twitter: string;
}
