import { Result } from '../../../constants/result';
import { dataSource } from '../../../db/datasource';
import { ErrorResult, NotFoundResult, SuccessResult } from '../../../interfaces/results';
import { Child } from '../../../db/entities/child.entity';
import { In } from 'typeorm';

export type CreateOrUpdateChildResult = SuccessResult<{ id: Child['id'] }> | ErrorResult;
export type ChildResult = SuccessResult<Child> | NotFoundResult | ErrorResult;

export class ChildService {
	async insertChild(child: Omit<Child, 'id'>): Promise<CreateOrUpdateChildResult> {
		const repository = dataSource.getRepository(Child);

		const createChild = repository.create(child);
		const result = await repository.save(createChild);

		return {
			type: Result.SUCCESS,
			data: result,
		};
	}

	async getChildrenByIds(ids: string[]): Promise<SuccessResult<Child[]> | ErrorResult> {
		try {
			const children = await dataSource.getRepository(Child).find({
				where: { id: In(ids) },
				select: [
					'id',
					'first_name',
					'last_name',
					'birthdate',
					'created_at',
					'updated_at',
					'nivo',
					'status',
				],
			});
			const result: SuccessResult<Child[]> = {
				type: Result.SUCCESS,
				data: children,
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
