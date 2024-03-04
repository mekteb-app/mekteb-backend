import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Roles } from '../db/enums';

export const checkRole = (allowedRole: Roles) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const userRole: Roles = req['user']?.role;

		if (userRole >= allowedRole) {
			next(); // User has the required role, proceed to the next middleware or route handler
		} else {
			res.status(StatusCodes.FORBIDDEN).json({ message: 'Unsufficient permissions' });
		}
	};
};
