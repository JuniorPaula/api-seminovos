import { Router } from 'express';
import UserController from '../controllers/UserController';

const router = Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/checkUser', UserController.checkUser);
router.get('/:id', UserController.show);

export default router;
