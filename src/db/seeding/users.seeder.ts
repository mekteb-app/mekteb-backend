import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { User } from '../entities/user.entity';
import { hashPassword } from '../../utils/jwt-password-helper';

export default class UsersSeeder implements Seeder {
	public async run(dataSource: DataSource): Promise<void> {
		const repository = dataSource.getRepository(User);

		await repository.insert([
			{
				first_name: 'Super',
				last_name: 'Admin',
				email: 'mirza.curic1@gmail.com',
				phone: '123456789',
				role: 10,
				password: hashPassword('Test1234!'),
			},
		]);
	}
}
