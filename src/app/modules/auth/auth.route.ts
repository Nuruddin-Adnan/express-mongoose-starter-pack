import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from '../user/user.validation';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';
import { FileUploadHelper } from '../../../helpers/FileUploadHelper';

const router = express.Router();

router.post(
  '/file-upload',
  FileUploadHelper.upload.single('image'),
  async (req, res) => {
    try {
      res.status(200).json(req.file);
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: "Couldn't upload the file",
        error: `${error}`,
      });
    }
  },
);

router.post(
  '/signup',
  validateRequest(UserValidation.createUserZodSchema),
  AuthController.createUser,
);

router.post(
  '/login',
  validateRequest(AuthValidation.loginZodSchema),
  AuthController.loginUser,
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.refreshToken,
);

// router.post(
//   '/change-password',
//   validateRequest(AuthValidation.changePasswordZodSchema),
//   auth(
//     ENUM_USER_ROLE.SUPER_ADMIN,
//     ENUM_USER_ROLE.ADMIN,
//     ENUM_USER_ROLE.BUYER,
//     ENUM_USER_ROLE.SELLER,
//     ENUM_USER_ROLE.GENERAL_USER,
//   ),
//   AuthController.changePassword
// );

export const AuthRoutes = router;
