// src/utils/cloudinary.storage.ts
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.config';

export const CloudinaryMulterStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'user-uploads',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});
