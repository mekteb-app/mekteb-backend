import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

const jwtDataOptions = {
	secret: process.env.JWT_SECRET,
	jwtExpiration: process.env.JWT_EXPIRATION,
};

const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
	if (err instanceof TokenExpiredError) {
		return res.status(StatusCodes.UNAUTHORIZED).send({ message: 'Unauthorized! Access Token expired!' });
	}
	return res.status(StatusCodes.UNAUTHORIZED).send({ message: 'Unauthorized!' });
};

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers['authorization'];
	if (!token) {
		return res.status(StatusCodes.UNAUTHORIZED).send({ message: 'Not authenticated' });
	}

	jwt.verify(token, jwtDataOptions.secret, (err, decoded) => {
		if (err) {
			return catchError(err, res);
		}
		req['user'] = decoded;
		return next();
	});
};
