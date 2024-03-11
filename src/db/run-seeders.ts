// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { Community } from './entities/community.entity';
import CommunitiesSeeder from './seeding/communities.seeder';
import { User } from './entities/user.entity';
import { Child } from './entities/child.entity';
import { Message } from './entities/message.entity';
import UsersSeeder from './seeding/users.seeder';

const options: DataSourceOptions & SeederOptions = {
	type: 'postgres',
	host: process.env.DATABASE_HOST || 'localhost',
	port: parseInt(process.env.DATABASE_PORT || '5432'),
	username: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME,
	logging: true,
	/** Import all of your entities you want to seed to the database */
	entities: [Community, User, Child, Message],
	// Additional configuration by typeorm-extension
	factories: [],
	seeds: [CommunitiesSeeder, UsersSeeder],
	ssl: {
		rejectUnauthorized: false,
	},
};

const dataSource = new DataSource(options);

dataSource.initialize().then(async () => {
	await dataSource.synchronize(true);
	await runSeeders(dataSource);
	process.exit();
});
