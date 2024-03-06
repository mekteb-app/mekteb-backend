import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Result } from '../../../constants/result';
import { LogHelper } from '../../../utils/log-helper';
import { UserService } from '../services/user.service';
import { Roles, Status } from '../../../db/enums/index';
import { ChildService } from '../../child/services/child.service';

export class CreateUserHandler {
	public static async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
		const userService = new UserService();
		const childService = new ChildService();

		// Create children first
		const rawChildren = req.body.newChildren?.length
			? await Promise.all(
					req.body.newChildren.map((child) => {
						return childService.insertChild({
							first_name: child.first_name,
							last_name: child.last_name,
							birthdate: child.birthdate,
							nivo: child.nivo,
							status: Status.ACTIVE,
							parents: undefined,
							messages: undefined,
							created_at: new Date(),
							updated_at: new Date(),
							community: child.communityId || req.body.communityId,
						});
					})
			  )
			: [];

		const childrenErrors = rawChildren.filter((child) => child.type === Result.ERROR);
		if (childrenErrors.length > 0) {
			LogHelper.error('An unexpected error occurred', childrenErrors);
			return next(childrenErrors[0].error);
		}

		const childrenIds = [
			...rawChildren.map((child) => child.data.id),
			...(req.body.childrenIds || []),
		];

		// Create user
		const createdUser = await userService.insertUser(
			{
				first_name: req.body.first_name,
				last_name: req.body.last_name,
				email: req.body.email,
				hashedPassword: '',
				created_at: new Date(),
				updated_at: new Date(),
				role: req.body.role || Roles.USER,
				phone: req.body.phone,
				birthdate: req.body.birthdate || null,
				community: req.body.communityId,
				status: Status.PENDING,
				messages: undefined,
				children: undefined,
			},
			childrenIds
		);

		if (createdUser.type === Result.ERROR) {
			LogHelper.error(createdUser.message, createdUser.error);
			return next(createdUser.error);
		}

		res.status(StatusCodes.ACCEPTED).json(createdUser.data);
	}
}
