import { Router } from 'express';
import { UserController } from './user/user.controller';
import { AuthController } from './auth/auth.controller';

const router = Router();

router.use('/users', UserController.router);
router.use('/auth', AuthController.router);

export const apiRouter = router;
