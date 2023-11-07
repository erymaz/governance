import mongoose, { Schema, Model, Document } from 'mongoose';

export type CommentDocument = Document & {
  author: string;
  content: string;
  communityId: number;
  proposalId: string;
};

export type CommentInput = {
  author: CommentDocument['author'];
  content: CommentDocument['content'];
  communityId: CommentDocument['communityId'];
  proposalId: CommentDocument['proposalId'];
};

const commentSchema = new Schema(
  {
    author: {
      type: Schema.Types.String,
      required: true,
    },
    content: {
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
    }
  },
  {
    collection: 'comments',
    timestamps: true,
  },
);

export const Comment: Model<CommentDocument> = mongoose.model<CommentDocument>('Comment', commentSchema);
