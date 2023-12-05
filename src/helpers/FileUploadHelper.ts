import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import * as fs from 'fs';
import { ICloudinaryResponse, IUploadFile } from '../interfaces/file';
import config from '../config';
import path from 'path';

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const supportedFormate = /svg|png|jpg|webp|gif/;
    const extension = path.extname(file.originalname);

    if (supportedFormate.test(extension)) {
      cb(null, true);
    } else {
      cb(new Error('Must be a svg/png/jpg/webp/gif image'));
    }
  },
  limits: {
    fileSize: 50000,
  },
});

const uploadToCloudinary = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file: IUploadFile,
): Promise<ICloudinaryResponse | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      (error: Error, result: ICloudinaryResponse) => {
        fs.unlinkSync(file.path);
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );
  });
};

export const FileUploadHelper = {
  uploadToCloudinary,
  upload,
};
