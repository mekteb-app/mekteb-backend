import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Result } from '../../../constants/result';
import { LogHelper } from '../../../utils/log-helper';
import { getUserByEmail } from '../services/user.service';
import { comparePassword } from '../../../utils/jwt-password-helper';
import jwt from 'jsonwebtoken';

export async function loginUser(req: Request, res: Response, next: NextFunction): Promise<void> {
	const userResult = await getUserByEmail(req.body.email);

	if (userResult.type === Result.ERROR) {
		LogHelper.error('An unexpected error occurred', userResult.message, userResult.error);
		return next(userResult.error);
	}

	// Verify password
	const passwordValid = comparePassword(req.body.password, userResult.data.password);
	if (!passwordValid) {
		res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid password' });
		return next();
	}

	// Generate token
	const token = jwt.sign({ id: userResult.data.id, role: userResult.data.role, email: userResult.data.email }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_REFRESH_EXPIRATION,
	});

	res.status(StatusCodes.ACCEPTED).json({
		id: userResult.data.id,
		first_name: userResult.data.first_name,
		last_name: userResult.data.last_name,
		role: userResult.data.role,
		email: userResult.data.email,
		accessToken: token,
	});
}
