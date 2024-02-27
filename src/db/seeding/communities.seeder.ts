import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Community } from '../entities/community.entity';

export default class CommunitiesSeeder implements Seeder {
	public async run(dataSource: DataSource): Promise<void> {
		const repository = dataSource.getRepository(Community);

		await repository.insert([
			{
				name: 'Jonkoping',
				address: 'Mellangatan 40',
				postalCode: 55451,
				created_at: new Date(),
				updated_at: new Date(),
			},
		]);
	}
}
