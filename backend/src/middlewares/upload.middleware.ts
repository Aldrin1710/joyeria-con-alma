import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';

const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Formato multimedia no permitido. Solo se aceptan archivos .jpg, .jpeg o .png'));
  }
};

export const uploadImages = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5, // Máximo 5 imágenes simultáneas
  },
  fileFilter,
});

export const uploadSingleImage = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter,
});
