import { Router } from 'express';
import CarsController from '../controllers/CarsController';
import { verifyToken } from '../middlewares/verify-token';

const router = Router();

router.post('/create', verifyToken, CarsController.create);

export default router;
