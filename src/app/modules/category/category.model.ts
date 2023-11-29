import { Schema, model } from 'mongoose';
import { CategoryModel, ICategory } from './category.interface';

const CategorySchema = new Schema<ICategory, CategoryModel>(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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

export const Category = model<ICategory, CategoryModel>(
  'Category',
  CategorySchema,
);
