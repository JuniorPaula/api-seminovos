import { Router } from 'express';
import imageUpload from '../config/multer-config';
import UserController from '../controllers/UserController';
import { verifyToken } from '../middlewares/verify-token';

const router = Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/checkUser', UserController.checkUser);
router.get('/:id', UserController.show);
router.patch(
  '/edit/:id',
  verifyToken,
  imageUpload.single('image'),
  UserController.update,
);

export default router;
