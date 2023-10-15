/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type IUser = {
  _id: Types.ObjectId;
  password: string;
  role: 'buyer' | 'seller' | 'general_user';
  name: {
    firstName: string;
    lastName: string;
  };
  phoneNumber: string;
  email: string;
  imgURL: string;
  address: string;
};

export type UserModel = {
  isUserExist(
    email: string,
  ): Promise<Pick<IUser, '_id' | 'name' | 'email' | 'password' | 'role'>>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
} & Model<IUser>;
