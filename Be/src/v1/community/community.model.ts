import mongoose, { Schema, Model, Document } from 'mongoose';

export type CommunityDocument = Document & {
  sid: number;
  guideline: string;
  admin: string;
};

export type CommunityInput = {
  sid: CommunityDocument['sid'];
  guideline: CommunityDocument['guideline'];
  admin: CommunityDocument['admin'];
};

const communitySchema = new Schema(
  {
    sid: {
      type: Schema.Types.Number,
      required: true,
    },
    guideline: {
      type: Schema.Types.String,
      default: '',
    },
    admin: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {
    collection: 'communities',
    timestamps: true,
  },
);

export const Community: Model<CommunityDocument> = mongoose.model<CommunityDocument>('Community', communitySchema);
