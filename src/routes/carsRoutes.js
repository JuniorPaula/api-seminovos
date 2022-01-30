import { Router } from 'express';
import CarsController from '../controllers/CarsController';

const router = Router();

router.post('/create', CarsController.create);

export default router;
