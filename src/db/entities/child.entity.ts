import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Community } from './community.entity';
import { Message } from './message.entity';
import { Nivo, Status } from '../enums';
import { Base } from './base';

@Entity('children')
export class Child extends Base {
	@Column()
	first_name: string;

	@Column()
	last_name: string;

	@Column({ type: 'enum', enum: Nivo })
	nivo: Nivo;

	@Column()
	birthdate: string;

	@Column({ default: Status.ACTIVE })
	status: Status;

	@ManyToMany(() => User, (user) => user.children)
	parents: User[];

	@ManyToOne(() => Community, (community) => community.children)
	community: Community;

	@OneToMany(() => Message, (message) => message.child)
	messages: Message[];
}
