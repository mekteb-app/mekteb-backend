import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Result } from '../../../constants/result';
import { LogHelper } from '../../../utils/log-helper';
import { UserService } from '../../../services/user.service';
import { comparePassword, generateToken } from '../../../utils/jwt-password-helper';
import { Status } from '../../../db/enums';

export class LoginHandler {
	public static async loginUser(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userService = new UserService();

			const userResult = await userService.getUserByEmailOrPhone(req.body.email, req.body.phone);

			if (userResult.type === Result.ERROR) {
				LogHelper.error('An unexpected error occurred', userResult.message, userResult.error);
				return next(userResult.error);
			}

			if (userResult.type === Result.NOT_FOUND || !userResult.data)
				return next(new Error('User not found'));
			if (userResult.data.status === Status.INACTIVE) return next(new Error('User is not active'));
			if (userResult.data.status === Status.PENDING) return next(new Error('User is not verified'));

			// Verify password
			const passwordValid = comparePassword(req.body?.password, userResult?.data?.hashedPassword);
			if (!passwordValid) {
				res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid password' });
			}

			// Generate token
			const token = generateToken({
				id: userResult?.data?.id,
				role: userResult?.data?.role,
				email: userResult?.data?.email,
			});

			res.status(StatusCodes.ACCEPTED).json({
				id: userResult.data.id,
				first_name: userResult.data.first_name,
				last_name: userResult.data.last_name,
				role: userResult.data.role,
				email: userResult.data.email,
				accessToken: token,
			});
		} catch (error) {
			LogHelper.error('An unexpected error occurred', error);
			next(error);
		}
	}
}
