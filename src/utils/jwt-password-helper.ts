import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const PASSWORD_PEPPER = process.env.PASSWORD_PEPPER || 'allahu_ekber';
const PASSWORD_SALT_ROUNDS = process.env.PASSWORD_SALT_ROUNDS || 10;

const jwtDataOptions = {
	secret: process.env.JWT_SECRET,
	jwtExpiration: process.env.JWT_EXPIRATION,
};

export const hashPassword = (password: string): string => {
	return bcrypt.hashSync(`${password}${PASSWORD_PEPPER}`, parseInt(PASSWORD_SALT_ROUNDS as string));
};

export const comparePassword = (password: string, hashedPassword: string): boolean => {
	return bcrypt.compareSync(`${password}${PASSWORD_PEPPER}`, hashedPassword);
};

export const generateToken = (payload: string | object | Buffer, expiration?: string): string => {
	return jwt.sign(payload, jwtDataOptions.secret, {
		expiresIn: expiration || jwtDataOptions.jwtExpiration,
	});
};

export const verifyToken = (token: string): Promise<string | object> => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, jwtDataOptions.secret, (err, decoded) => {
			if (err) {
				reject(err);
			}
			resolve(decoded);
		});
	});
};
