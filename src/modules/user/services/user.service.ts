import { InsertResult } from 'typeorm';
import { Result } from '../../../constants/result';
import { dataSource } from '../../../db/datasource';
import { ErrorResult, NotFoundResult, SuccessResult } from '../../../interfaces/results';
import { User } from '../../../db/entities/user.entity';

export type CreateOrUpdateUserResult = SuccessResult<{ id: User['id'] }> | ErrorResult;
export type UserResult = SuccessResult<User> | NotFoundResult | ErrorResult;

export function insertUser(user: Omit<User, 'id'>): Promise<CreateOrUpdateUserResult> {
	return dataSource
		.getRepository(User)
		.insert(user)
		.then<SuccessResult<{ id: User['id'] }>>((insertedUser: InsertResult) => ({
			type: Result.SUCCESS,
			data: { id: insertedUser.raw[0].id },
		}))
		.catch(error => ({
			type: Result.ERROR,
			message: `An unexpected error occurred during creating user`,
			error,
		}));
}

export function getUsers(): Promise<SuccessResult<User[]> | ErrorResult> {
	return dataSource
		.getRepository(User)
		.find({
			select: ['id', 'first_name', 'last_name', 'email', 'role', 'phone', 'created_at', 'updated_at', 'community', 'children'],
			relations: { children: true, community: true },
		})
		.then<SuccessResult<User[]>>((users: User[]) => ({
			type: Result.SUCCESS,
			data: users,
		}))
		.catch(error => ({
			type: Result.ERROR,
			message: error.message,
			error,
		}));
}
