export interface Community {
  id: number;
  controller: string;
  name: string;
  description: string;
  iconUrl: string;
  website: string;
  strategies: string[];
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
  tokenAmount: number;
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
  id: number
  author: string;
  communityId: number;
  title: string;
  content: string;
  discussion: string;
  strategy: string;
  votingSystem: string;
  candidates: Candidate[];
  tokenAmount: number;
  quorum: number;
  startTime: number;
  endTime: number;
  confirmed: boolean;
  approve: ProposalStatus;
}

export interface Comment {
  _id: string;
  author: string;
  content: string;
  communityId: number;
  proposalId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Winner {
  id: number;
  weight: number;
  tokenAmount: number;
}

export interface Vote {
  id: number;
  voter: string;
  communityId: number;
  proposalId: number;
  winners: Winner[];
  tokenAmount: number;
  timestamp: number;
}

export interface User {
  account: string;
  communities: string[];
}

export type Strategies = Record<string, any>;

export interface BalanceRow {
  account: string;
  amount: number;
}

export type BalanceHolder = Record<string, BalanceRow>;
