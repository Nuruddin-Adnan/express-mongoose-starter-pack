import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';

export type ICategory = {
  _id: Types.ObjectId;
  name: string;
  user: Types.ObjectId | IUser;
};

export type CategoryModel = Model<ICategory, Record<string, unknown>>;
