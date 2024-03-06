import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions/HttpException';
import { LogHelper } from '../utils/log-helper';

const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
	try {
		const status: number = error.status || 500;
		const message: string = error.message || 'Something went wrong';

		LogHelper.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
		res.status(status).json({ message });
	} catch (error) {
		next(error);
	}
};

export default errorMiddleware;
