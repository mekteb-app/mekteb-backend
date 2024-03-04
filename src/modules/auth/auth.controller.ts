import { Router } from 'express';
import { AuthHandler } from './handlers/login-user';

const authRouter = Router();

authRouter.post('/login', AuthHandler.loginUser);

export const AuthController = { router: authRouter };
