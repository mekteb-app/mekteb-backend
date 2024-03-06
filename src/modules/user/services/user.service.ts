import { In } from 'typeorm';
import { Result } from '../../../constants/result';
import { dataSource } from '../../../db/datasource';
import { ErrorResult, NotFoundResult, SuccessResult } from '../../../interfaces/results';
import { User } from '../../../db/entities/user.entity';
import { Child } from '../../../db/entities/child.entity';

export type CreateOrUpdateUserResult = SuccessResult<User> | ErrorResult;
export type UserResult = SuccessResult<User> | NotFoundResult | ErrorResult;

export class UserService {
	async insertUser(
		user: Omit<User, 'id'>,
		childrenIds: string[]
	): Promise<CreateOrUpdateUserResult> {
		const userRepository = dataSource.getRepository(User);
		const childRepository = dataSource.getRepository(Child);

		const children = await childRepository.findBy({ id: In(childrenIds) });

		const createdUser = userRepository.create({
			...user,
			children,
		});

		return {
			type: Result.SUCCESS,
			data: await userRepository.save(createdUser),
		};
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
