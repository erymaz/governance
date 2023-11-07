import mongoose, { Schema, Model, Document } from 'mongoose';
import { Candidate } from '../../types';

export type AggregationDocument = Document & {
  time: number;
  communityId: number;
  proposalId: number;
  result: Candidate[];
  tokenAmount: number;
};

export type AggregationInput = {
  time: AggregationDocument['time'];
  communityId: AggregationDocument['communityId'];
  proposalId: AggregationDocument['proposalId'];
  result: AggregationDocument['result'];
  tokenAmount: AggregationDocument['tokenAmount'];
};

const aggregationSchema = new Schema(
  {
    time: {
      type: Schema.Types.Number,
      required: true,
    },
    communityId: {
      type: Schema.Types.Number,
      required: true,
    },
    proposalId: {
      type: Schema.Types.Number,
      required: true,
    },
    result: {
      type: Schema.Types.Array,
      required: true,
    },
    tokenAmount: {
      type: Schema.Types.Number,
      require: true,
    },
  },
  {
    collection: 'aggregations',
    timestamps: true,
  },
);

export const Aggregation: Model<AggregationDocument> = mongoose.model<AggregationDocument>('Aggregation', aggregationSchema);
