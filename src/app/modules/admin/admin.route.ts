import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AdminController } from './admin.controller';
import { AdminValidation } from './admin.validation';
import { AuthValidation } from '../auth/auth.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.post(
  '/create-admin',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(AdminValidation.createAdminZodSchema),
  AdminController.createAdmin,
);

router.post(
  '/login',
  validateRequest(AuthValidation.loginZodSchema),
  AdminController.loginUser,
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AdminController.refreshToken,
);

router.get(
  '/my-profile',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  AdminController.getMyProfile,
);

router.patch(
  '/my-profile',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(AdminValidation.updateAdminZodSchema),
  AdminController.updateMyProfile,
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  AdminController.deleteAdmin,
);

export const AdminRoutes = router;
