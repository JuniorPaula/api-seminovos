import { Router } from 'express';
import { verifyToken } from '../middlewares/verify-token';
import CarsController from '../controllers/CarsController';
import imageUpload from '../config/multer-config';

const router = Router();

router.post(
  '/create',
  verifyToken,
  imageUpload.array('images'),
  CarsController.create,
);

export default router;
