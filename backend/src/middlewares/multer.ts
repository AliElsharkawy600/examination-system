import multer, { StorageEngine } from 'multer';
import path from 'path';
import { Request } from 'express';
import CustomError from '../utils/CustomError.js';

const storage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, 'uploads/');
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const ext = path.extname(file.originalname);
    cb(null, `question-${Date.now()}${ext}`);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new CustomError('Not an image! Please upload only images.', 400) as any, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

export default upload;
