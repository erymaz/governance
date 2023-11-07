import mongoose, { Schema, Model, Document } from 'mongoose';

export type UserDocument = Document & {
  account: string;
  communities: number[]
};

export type UserInput = {
  account: UserDocument['account'];
  communities: UserDocument['communities'];
};

const userSchema = new Schema(
  {
    account: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    communities: {
      type: Schema.Types.Array,
      default: [],
    },
  },
  {
    collection: 'users',
    timestamps: true,
  },
);

export const User: Model<UserDocument> = mongoose.model<UserDocument>('User', userSchema);
