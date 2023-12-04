import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { IGenericResponse } from '../../../interfaces/common';
import { IFilters, IQueries } from '../../../interfaces/queryFilters';
import searcher from '../../../shared/searcher';
import { ICategory } from './category.interface';
import { Category } from './category.model';
import { categorySearchableFields } from './category.constant';
import { Aggregate } from 'mongoose';
import generatePipeline from '../../../shared/generatePipeline';

const createCategory = async (payload: ICategory): Promise<ICategory> => {
  const result = await Category.create(payload);
  return result;
};

const getAllCategories = async (
  filters: IFilters,
  queries: IQueries,
): Promise<IGenericResponse<ICategory[]>> => {
  const conditions = searcher(filters, categorySearchableFields);

  const { limit = 0, skip, fields, sort } = queries;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const initialPipeline: any[] = [
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
        pipeline: [
          {
            $project: {
              name: 1,
              phoneNumber: 1,
            },
          },
        ],
      },
    },
    { $unwind: '$user' },
  ];

  const pipeline = generatePipeline(
    initialPipeline,
    conditions,
    skip,
    fields,
    sort,
    limit,
    {
      $group: { _id: '$user.name', count: { $count: {} } },
    },
  );

  const aggregationPipeline: Aggregate<ICategory[]> =
    Category.aggregate(pipeline);

  const [result, total] = await Promise.all([
    aggregationPipeline.exec(),
    Category.countDocuments(conditions),
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

// const getAllCategories = async (
//   filters: IFilters,
//   queries: IQueries,
// ): Promise<IGenericResponse<ICategory[]>> => {
//   const conditions = searcher(filters, categorySearchableFields);

//   const { limit = 0, skip, fields, sort } = queries;

//   const resultQuery = Category.find(conditions)
//     .populate('user')
//     .skip(skip as number)
//     .select(fields as string)
//     .sort(sort)
//     .limit(limit as number);

//   const [result, total] = await Promise.all([
//     resultQuery.exec(),
//     Category.countDocuments(conditions),
//   ]);

//   const page = Math.ceil(total / limit);

//   return {
//     meta: {
//       page,
//       limit,
//       total,
//     },
//     data: result,
//   };
// };

const getSingleCategory = async (id: string): Promise<ICategory | null> => {
  if (!id) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category Not found');
  }

  const result = await Category.findById(id);

  return result;
};

const updateCategory = async (
  id: string,
  payload: Partial<ICategory>,
): Promise<ICategory | null> => {
  if (!id) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category Not found');
  }

  const targetedData = await Category.findById(id);

  if (!targetedData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category Not found');
  }

  const result = await Category.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return result;
};

const deleteCategory = async (id: string): Promise<ICategory | null> => {
  if (!id) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category Not found');
  }
  const result = await Category.findByIdAndDelete(id);
  return result;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
