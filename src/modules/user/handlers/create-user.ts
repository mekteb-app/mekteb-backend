import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Result } from '../../../constants/result';
import { LogHelper } from '../../../utils/log-helper';
import { UserService } from '../../../services/user.service';
import { Roles, Status } from '../../../db/enums/index';
import { ChildService } from '../../child/services/child.service';
import { generateToken } from '../../../utils/jwt-password-helper';
import { sendUserVerificationEmail } from '../../../utils/send-email';
import { ErrorResult, SuccessResult } from '../../../interfaces/results';
import { User } from '../../../db/entities/user.entity';

export type CreateOrUpdateUserResult = SuccessResult<User> | ErrorResult;

export class CreateUserHandler {
	public static async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
		const userService = new UserService();
		const childService = new ChildService();

		// Check if user exists
		const userResult = await userService.getUserByEmailOrPhone(req.body.email, req.body.phone);
		console.log('userResult', userResult);
		if (userResult?.['data']) {
			LogHelper.error('User already exists', req.body.email, req.body.phone);
			return next(new Error('User already exists'));
		}

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

		// Send email
		const token = generateToken({ id: createdUser.data.id, email: createdUser.data.email }, '1y');
		await sendUserVerificationEmail(req.body.email, req.body.first_name, token);

		res.status(StatusCodes.ACCEPTED).json(createdUser.data);
	}
}
