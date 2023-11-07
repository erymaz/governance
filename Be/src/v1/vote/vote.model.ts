import mongoose, { Schema, Model, Document } from 'mongoose';
import { Winner } from '../../types';

export type VoteDocument = Document & {
  voter: string;
  communityId: number;
  proposalId: string;
  winners: Winner[];
  tokenAmount: number;
  timestamp: number;
};

export type VoteInput = {
  voter: VoteDocument['voter'];
  communityId: VoteDocument['communityId'];
  proposalId: VoteDocument['proposalId'];
  winners: VoteDocument['winners'];
  tokenAmount: VoteDocument['tokenAmount'];
  timestamp: VoteDocument['timestamp'];
};

const voteSchema = new Schema(
  {
    voter: {
      type: Schema.Types.String,
      required: true,
    },
    communityId: {
      type: Schema.Types.Number,
      required: true,
    },
    proposalId: {
      type: Schema.Types.String,
      required: true,
    },
    winners: {
      type: Schema.Types.Array,
      required: true,
    },
    tokenAmount: {
      type: Schema.Types.Number,
      default: 0,
    },
    timestamp: {
      type: Schema.Types.Number,
      required: true
    },
  },
  {
    collection: 'votes',
    timestamps: true,
  },
);

export const Vote: Model<VoteDocument> = mongoose.model<VoteDocument>('Vote', voteSchema);
