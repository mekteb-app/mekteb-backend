import bcrypt from 'bcryptjs';

const PASSWORD_PEPPER = process.env.PASSWORD_PEPPER || 'allahu_ekber';
const PASSWORD_SALT_ROUNDS = process.env.PASSWORD_SALT_ROUNDS || 10;

export const hashPassword = (password: string): string => {
	return bcrypt.hashSync(`${password}${PASSWORD_PEPPER}`, parseInt(PASSWORD_SALT_ROUNDS as string));
};

export const comparePassword = (password: string, hashedPassword: string): boolean => {
	return bcrypt.compareSync(`${password}${PASSWORD_PEPPER}`, hashedPassword);
};
