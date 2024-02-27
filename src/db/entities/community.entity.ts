import { Column, Entity, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Child } from './child.entity';
import { Base } from './base';

@Entity('communities')
export class Community extends Base {
	@Column({ unique: true })
	name: string;

	@Column()
	address: string;

	@Column()
	postalCode: number;

	@OneToMany(() => User, user => user.community)
	users: User[];

	@OneToMany(() => Child, child => child.community)
	children: Child[];
}
