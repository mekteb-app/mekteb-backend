import { Router } from 'express';
import { createUser } from './handlers/create-user';
import { getAllUsers } from './handlers/get-all-users';
import { verifyToken } from '../../middlewares/auth.middleware';

const userRouter = Router();

userRouter.get('/', verifyToken, getAllUsers);

userRouter.post('/', createUser);

export const UserController = { router: userRouter };
