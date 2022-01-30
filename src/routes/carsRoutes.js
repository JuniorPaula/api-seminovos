import { Router } from 'express';
import { verifyToken } from '../middlewares/verify-token';
import CarsController from '../controllers/CarsController';
import imageUpload from '../config/multer-config';

const router = Router();

router.get('/', CarsController.index);
router.get('/owncars', verifyToken, CarsController.getAllUserCar);
router.get('/ownbuyer', verifyToken, CarsController.getAllUserBuyer);
router.post(
  '/create',
  verifyToken,
  imageUpload.array('images'),
  CarsController.create,
);

export default router;
