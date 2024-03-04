import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Result } from '../../../constants/result';
import { LogHelper } from '../../../utils/log-helper';
import { UserService } from '../services/user.service';
import { comparePassword } from '../../../utils/jwt-password-helper';
import jwt from 'jsonwebtoken';

export class AuthHandler {
	public static async loginUser(req: Request, res: Response, next: NextFunction): Promise<void> {
		const userService = new UserService();

		const userResult = await userService.getUserByEmailOrPhone(req.body.email, req.body.phone);

		if (userResult.type === Result.ERROR) {
			LogHelper.error('An unexpected error occurred', userResult.message, userResult.error);
			return next(userResult.error);
		}

		if (userResult.type === Result.NOT_FOUND) {
			res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
			return next(userResult.message);
		}

		// Verify password
		const passwordValid = comparePassword(req.body?.password, userResult?.data?.hashedPassword);
		if (!passwordValid) {
			res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid password' });
		}

		// Generate token
		const token = jwt.sign(
			{ id: userResult?.data?.id, role: userResult?.data?.role, email: userResult?.data?.email },
			process.env.JWT_SECRET,
			{
				expiresIn: process.env.JWT_EXPIRATION,
			}
		);

		res.status(StatusCodes.ACCEPTED).json({
			id: userResult.data.id,
			first_name: userResult.data.first_name,
			last_name: userResult.data.last_name,
			role: userResult.data.role,
			email: userResult.data.email,
			accessToken: token,
		});
	}
}
