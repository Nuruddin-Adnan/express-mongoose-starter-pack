/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type IAdmin = {
  _id: Types.ObjectId;
  password: string;
  role: 'admin';
  name: {
    firstName: string;
    lastName: string;
  };
  phoneNumber: string;
  email: string;
  address: string;
};

// export type AdminModel = Model<IAdmin, Record<string, unknown>>;

export type AdminModel = {
  isUserExist(
    email: string,
  ): Promise<Pick<IAdmin, '_id' | 'name' | 'email' | 'password' | 'role'>>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
} & Model<IAdmin>;
