import { Column, Entity, ManyToMany, OneToMany, JoinTable, ManyToOne } from 'typeorm';
import { Community } from './community.entity';
import { IsEmail, IsPhoneNumber } from 'class-validator';
import { Child } from './child.entity';
import { Message } from './message.entity';
import { Roles, Status } from '../enums';
import { Base } from './base';

@Entity('users')
export class User extends Base {
	@Column()
	first_name: string;

	@Column()
	last_name: string;

	@Column({ unique: true })
	@IsEmail({}, { message: 'Invalid email format' })
	email: string;

	@Column()
	@IsPhoneNumber()
	phone: string;

	@Column({ type: 'text' })
	hashedPassword: string;

	@Column({ nullable: true })
	birthdate: string;

	@Column({ default: Status.PENDING })
	status: Status;

	@Column({ type: 'enum', enum: Roles })
	role: Roles;

	@ManyToOne(() => Community, (community) => community.users, { nullable: true })
	community: Community;

	@ManyToMany(() => Child, (child) => child.parents, { cascade: true })
	@JoinTable()
	children: Child[];

	@OneToMany(() => Message, (message) => message.sender, { nullable: true })
	messages: Message[];
}
