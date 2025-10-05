import mongoose, { Schema, model, models } from 'mongoose';

export interface IUser {
  clerk_id: string;
  email: string;
  fullname: string;
  avatar_url: string;
}

const UserSchema = new Schema<IUser>(
  {
    clerk_id: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    avatar_url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = models.User || model<IUser>('User', UserSchema);

export default User;
