import { Router } from 'express';
import { CreateUserHandler } from './handlers/create-user';
import { GetAllUsersHandler } from './handlers/get-all-users';
import { verifyToken } from '../../middlewares/auth.middleware';
import { checkRole } from '../../middlewares/role.middleware';
import { Roles } from '../../db/enums';

const userRouter = Router();

// TODO Only role admin can access this route
userRouter.get('/', verifyToken, checkRole(Roles.ADMIN), GetAllUsersHandler.getAllUsers);
// TODO Validate dto
userRouter.post('/', verifyToken, CreateUserHandler.createUser);

export const UserController = { router: userRouter };
