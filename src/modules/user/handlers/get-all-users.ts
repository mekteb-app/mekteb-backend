import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Result } from '../../../constants/result';
import { LogHelper } from '../../../utils/log-helper';
import { getUsers } from '../services/user.service';

export async function getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
	const usersResult = await getUsers();

	if (usersResult.type === Result.ERROR) {
		LogHelper.error('An unexpected error occurred', usersResult.message, usersResult.error);
		return next(usersResult.error);
	}
	res.status(StatusCodes.OK).json(usersResult.data);
}
