import { Router } from 'express';
import { loginUser } from './handlers/login-user';

const authRouter = Router();

authRouter.post('/login', loginUser);

export const AuthController = { router: authRouter };
