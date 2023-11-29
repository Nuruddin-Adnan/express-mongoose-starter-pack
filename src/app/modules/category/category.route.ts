import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryValidation } from './category.validation';
import { CategoryController } from './category.controller';

const router = express.Router();

router.post(
  '/create-category',
  validateRequest(CategoryValidation.createCategoryZodSchema),
  CategoryController.createCategory,
);

router.patch(
  '/:id',
  validateRequest(CategoryValidation.updateCategoryZodSchema),
  CategoryController.updateCategory,
);

router.delete('/:id', CategoryController.deleteCategory);

router.get('/:id', CategoryController.getSingleCategory);

router.get('/', CategoryController.getAllCategories);

export const CategoryRoutes = router;
