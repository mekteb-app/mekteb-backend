import { InsertResult } from 'typeorm';
import { Result } from '../../../constants/result';
import { dataSource } from '../../../db/datasource';
import { ErrorResult, NotFoundResult, SuccessResult } from '../../../interfaces/results';
import { User } from '../../../db/entities/user.entity';

export type CreateOrUpdateUserResult = SuccessResult<{ id: User['id'] }> | ErrorResult;
export type UserResult = SuccessResult<User> | NotFoundResult | ErrorResult;

export class UserService {
	async insertUser(user: Omit<User, 'id'>): Promise<CreateOrUpdateUserResult> {
		return dataSource
			.getRepository(User)
			.insert(user)
			.then<SuccessResult<{ id: User['id'] }>>((insertedUser: InsertResult) => ({
				type: Result.SUCCESS,
				data: { id: insertedUser.raw[0].id },
			}))
			.catch((error) => ({
				type: Result.ERROR,
				message: `An unexpected error occurred during creating user`,
				error,
			}));
	}

	async getUsers(): Promise<SuccessResult<User[]> | ErrorResult> {
		try {
			const users = await dataSource.getRepository(User).find({
				select: [
					'id',
					'first_name',
					'last_name',
					'email',
					'role',
					'phone',
					'created_at',
					'updated_at',
					'community',
					'children',
				],
				relations: { children: true, community: true },
			});
			const result: SuccessResult<User[]> = {
				type: Result.SUCCESS,
				data: users,
			};
			return result;
		} catch (error) {
			return {
				type: Result.ERROR,
				message: error.message,
				error,
			};
		}
	}
}
