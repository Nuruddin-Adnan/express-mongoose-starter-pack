import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../../config';
import { adminRole } from './admin.constant';
import { AdminModel, IAdmin } from './admin.interface';

const adminSchema = new Schema<IAdmin, AdminModel>(
  {
    password: {
      type: String,
      required: true,
      select: 0,
    },
    role: {
      type: String,
      enum: {
        values: adminRole,
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
      unique: true,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

adminSchema.statics.isUserExist = async function (
  phoneNumber: string,
): Promise<IAdmin | null> {
  return await Admin.findOne(
    { phoneNumber },
    { phoneNumber: 1, password: 1, role: 1 },
  );
};

adminSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

// Admin.create() / user.save()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminSchema.pre('save', async function (next: any) {
  // hashing user password
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bycrypt_salt_rounds),
  );

  next();
});

// Create an index for phoneNumber field
// adminSchema.index({ phoneNumber: 1 }, { unique: true });

export const Admin = model<IAdmin, AdminModel>('Admin', adminSchema);
