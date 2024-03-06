import { Router } from 'express';
import { UserController } from './user/user.controller';
import { AuthController } from './auth/auth.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.use('/users', verifyToken, UserController.router);
router.use('/auth', AuthController.router);

export const apiRouter = router;
