import { Router } from 'express';
import { CreateUserHandler } from './handlers/create-user';
import { GetAllUsersHandler } from './handlers/get-all-users';
import { checkRole } from '../../middlewares/role.middleware';
import { Roles } from '../../db/enums';
import validatePayload from '../../middlewares/payload-validation.middleware';
import { CreateUserDto } from '../../dtos/create-user.dto';

const userRouter = Router();

userRouter.get('/', checkRole(Roles.ADMIN), GetAllUsersHandler.getAllUsers);
userRouter.post(
	'/',
	checkRole(Roles.ADMIN),
	validatePayload(CreateUserDto, 'body'),
	CreateUserHandler.createUser
);

export const UserController = { router: userRouter };
