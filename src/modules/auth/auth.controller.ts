import { Router } from 'express';
import { LoginHandler } from './handlers/login-user';
import { VerifyUserHandler } from './handlers/verify-user';
import { LoginUserDto } from '../../dtos/login-user.dto';
import validatePayload from '../../middlewares/payload-validation.middleware';
import { VerifyUserDto } from '../../dtos/verify-user.dto';

const authRouter = Router();

authRouter.post('/login', validatePayload(LoginUserDto, 'body'), LoginHandler.loginUser);
authRouter.post(
	'/verify-user',
	validatePayload(VerifyUserDto, 'body'),
	VerifyUserHandler.verifyUser
);

export const AuthController = { router: authRouter };
