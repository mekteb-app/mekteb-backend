import { RequestHandler } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { HttpException } from '../exceptions/HttpException';

const validatePayload = (
	schema: new () => object,
	value: string | 'body' | 'query' | 'params' = 'body',
	skipMissingProperties = false,
	whitelist = true,
	forbidNonWhitelisted = true
): RequestHandler => {
	return (req, _res, next) => {
		validate(plainToInstance(schema, req[value]), {
			skipMissingProperties,
			whitelist,
			forbidNonWhitelisted,
		}).then((errors: ValidationError[]) => {
			if (errors.length > 0) {
				const message = errors
					.map((error: ValidationError) => Object.values(error.constraints))
					.join(', ');
				next(new HttpException(400, message));
			} else {
				next();
			}
		});
	};
};

export default validatePayload;
