import { Result } from '../../../constants/result';
import { dataSource } from '../../../db/datasource';
import { ErrorResult, NotFoundResult, SuccessResult } from '../../../interfaces/results';
import { User } from '../../../db/entities/user.entity';

export type UserResult = SuccessResult<User> | NotFoundResult | ErrorResult;

export function getUserByEmail(email: string): Promise<SuccessResult<User> | ErrorResult> {
	return dataSource
		.getRepository(User)
		.findOne({ where: { email } })
		.then<SuccessResult<User>>((user: User) => ({
			type: Result.SUCCESS,
			data: user,
		}))
		.catch(error => ({
			type: Result.ERROR,
			message: error.message,
			error,
		}));
}
