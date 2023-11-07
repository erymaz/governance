import mongoose, { Schema, Model, Document } from 'mongoose';
import { Candidate } from '../../types';

export type ProposalDocument = Document & {
  sid: number;
  author: string;
  communityId: number;
  title: string;
  description: string;
  discussion: string;
  strategy: string;
  votingSystem: string;
  candidates: Candidate[];
  tokenAmount: number;
  quorum: number;
  startTime: number;
  endTime: number;
  confirmed: boolean;
  approve: string;
};

export type ProposalInput = {
  sid: ProposalDocument['sid'],
  author: ProposalDocument['author'],
  communityId: ProposalDocument['communityId'];
  title: ProposalDocument['title'],
  description?: ProposalDocument['description'];
  discussion?: ProposalDocument['discussion'];
  strategy: ProposalDocument['strategy'];
  votingSystem: ProposalDocument['votingSystem'];
  candidates: ProposalDocument['candidates'];
  tokenAmount: ProposalDocument['tokenAmount'];
  quorum: ProposalDocument['quorum'];
  startTime: ProposalDocument['startTime'];
  endTime: ProposalDocument['endTime'];
  confirmed: ProposalDocument['confirmed'];
  approve: ProposalDocument['approve'];
};

const proposalSchema = new Schema(
  {
    sid: {
      type: Schema.Types.Number,
      required: false,
    },
    author: {
      type: Schema.Types.String,
      required: true,
    },
    communityId: {
      type: Schema.Types.Number,
      required: true,
    },
    title: {
      type: Schema.Types.String,
      required: true,
    },
    description: {
      type: Schema.Types.String,
      required: false,
    },
    discussion: {
      type: Schema.Types.String,
      required: false,
    },
    strategy: {
      type: Schema.Types.String,
      required: true,
    },
    votingSystem: {
      type: Schema.Types.String,
      required: true,
    },
    candidates: {
      type: Schema.Types.Array,
      required: true,
    },
    tokenAmount: {
      type: Schema.Types.Number,
      default: 0,
    },
    quorum: {
      type: Schema.Types.Number,
      default: 0,
    },
    startTime: {
      type: Schema.Types.Number,
      required: true,
    },
    endTime: {
      type: Schema.Types.Number,
      required: true,
    },
    confirmed: {
      type: Schema.Types.Boolean,
      required: true,
    },
    approve: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {
    collection: 'proposals',
    timestamps: true,
  },
);

export const Proposal: Model<ProposalDocument> = mongoose.model<ProposalDocument>('Proposal', proposalSchema);
