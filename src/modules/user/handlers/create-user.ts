import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Result } from '../../../constants/result';
import { LogHelper } from '../../../utils/log-helper';
import { insertUser } from '../services/user.service';
import { Roles } from '../../../db/enums/index';
import { hashPassword } from '../../../utils/jwt-password-helper';

export async function createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
	const inserted = await insertUser({
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		hashedPassword: hashPassword(req.body.password),
		created_at: new Date(),
		updated_at: new Date(),
		role: req.body.role || Roles.USER,
		phone: req.body.phone,
		community: req.body.community || null,
		children: req.body.children || [],
		messages: [],
	});

	if (inserted.type === Result.ERROR) {
		LogHelper.error(inserted.message, inserted.error);
		return next(inserted.error);
	}

	res.status(StatusCodes.ACCEPTED).json(inserted.data);
}
