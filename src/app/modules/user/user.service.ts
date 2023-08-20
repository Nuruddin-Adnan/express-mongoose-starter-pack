import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { IGenericResponse } from '../../../interfaces/common';
import { IFilters, IQueries } from '../../../interfaces/queryFilters';
import searcher from '../../../shared/searcher';
import { role, userSearchableFields } from './user.constant';
import { IUser } from './user.interface';
import { User } from './user.model';

const getAllUsers = async (
  filters: IFilters,
  queries: IQueries,
): Promise<IGenericResponse<IUser[]>> => {
  const conditions = searcher(filters, userSearchableFields);

  const { limit = 0, skip, fields, sort } = queries;

  const resultQuery = User.find(conditions)
    .skip(skip as number)
    .select(fields as string)
    .sort(sort)
    .limit(limit as number);

  const [result, total] = await Promise.all([
    resultQuery.exec(),
    User.countDocuments(conditions),
  ]);

  const page = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id);
  return result;
};

const updateUser = async (
  id: string,
  payload: Partial<IUser>,
): Promise<IUser | null> => {
  if (payload.role && !role.includes(payload.role)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid user role');
  }

  // destructure the {name} for dynamic update of nested value
  const { name, ...userData } = payload;

  const updatedUserData: Partial<IUser> = { ...userData };

  // dynamically handling
  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IUser>; // `name.fisrtName`
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (updatedUserData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await User.findOneAndUpdate({ _id: id }, updatedUserData, {
    new: true,
  });

  return result;
};

const deleteUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findByIdAndDelete(id);
  return result;
};

const getMyProfile = async (id: string): Promise<IUser | null> => {
  if (!id) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Not found');
  }
  const result = await User.findById(id);
  return result;
};

const updateMyProfile = async (
  id: string,
  payload: Partial<IUser>,
): Promise<IUser | null> => {
  if (!id) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Not found');
  }

  // Check if the payload contains the role field and validate its value
  if (payload.role && !role.includes(payload.role)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid user role');
  }

  // destructure the {name} for dynamic update of nested value
  const { name, ...userData } = payload;

  const updatedUserData: Partial<IUser> = { ...userData };

  // dynamically handling
  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IUser>; // `name.fisrtName`
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (updatedUserData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await User.findOneAndUpdate({ _id: id }, updatedUserData, {
    new: true,
    runValidators: true,
  });

  return result;
};

export const UserService = {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  getMyProfile,
  updateMyProfile,
};
