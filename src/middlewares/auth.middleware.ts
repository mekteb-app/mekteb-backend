import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../utils/jwt-password-helper';

const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
	if (err instanceof TokenExpiredError) {
		return res
			.status(StatusCodes.UNAUTHORIZED)
			.send({ message: 'Unauthorized! Access Token expired!' });
	}
	return res.status(StatusCodes.UNAUTHORIZED).send({ message: 'Unauthorized!' });
};

export const validateToken = (req: Request, res: Response, next: NextFunction) => {
	const token = (req.headers['authorization'] || '').replace('Bearer ', '');

	if (!token) {
		return res.status(StatusCodes.UNAUTHORIZED).send({ message: 'Not authenticated' });
	}

	verifyToken(token)
		.then((decoded) => {
			req['user'] = decoded;
			return next();
		})
		.catch((err) => {
			return catchError(err, res);
		});
};
