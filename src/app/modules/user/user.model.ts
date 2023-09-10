import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../../config';
import { role } from './user.constant';
import { IUser, UserModel } from './user.interface';

const userSchema = new Schema<IUser, UserModel>(
  {
    password: {
      type: String,
      required: true,
      select: 0,
    },
    role: {
      type: String,
      enum: {
        values: role,
        message: 'User role can be `{VALUE}`',
      },
    },
    name: {
      type: {
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
      },
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    imgURL: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

userSchema.statics.isUserExist = async function (
  email: string,
): Promise<IUser | null> {
  return await User.findOne({ email }, { email: 1, password: 1, role: 1 });
};

userSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

// User.create() / user.save()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
userSchema.pre('save', async function (next: any) {
  // hashing user password
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bycrypt_salt_rounds),
  );

  next();
});

// Create an index for phoneNumber field
userSchema.index({ email: 1 }, { unique: true });

export const User = model<IUser, UserModel>('User', userSchema);
