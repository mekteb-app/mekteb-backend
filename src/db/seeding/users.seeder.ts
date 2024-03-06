import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { User } from '../entities/user.entity';
import { hashPassword } from '../../utils/jwt-password-helper';
import { Roles, Status } from '../enums';
export default class UsersSeeder implements Seeder {
	public async run(dataSource: DataSource): Promise<void> {
		const repository = dataSource.getRepository(User);

		const password = hashPassword('Test1234!');

		await repository.insert([
			{
				first_name: 'Super',
				last_name: 'Admin',
				email: 'mirza.curic1@gmail.com',
				phone: '123456789',
				role: Roles.SUPER_ADMIN,
				hashedPassword: password,
				created_at: new Date(),
				updated_at: new Date(),
				status: Status.ACTIVE,
			},
		]);
	}
}
