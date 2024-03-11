import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Result } from '../../../constants/result';
import { UserService } from '../../../services/user.service';
import { verifyToken, hashPassword } from '../../../utils/jwt-password-helper';

export class VerifyUserHandler {
	public static async verifyUser(req: Request, res: Response, next: NextFunction): Promise<void> {
		const userService = new UserService();

		if (req.body.password !== req.body.confirmPassword)
			return next(new Error('Passwords do not match'));

		const user = await verifyToken(req.body.token);

		const hashedPassword = hashPassword(req.body.password);
		const userResult = await userService.verifyUser(user?.['id'], hashedPassword);

		if (userResult.type !== Result.SUCCESS) {
			return next(new Error(`${userResult.message} - ${user?.['email']}`));
		}

		res.status(StatusCodes.OK).json({ message: 'User verified' });
	}
}
