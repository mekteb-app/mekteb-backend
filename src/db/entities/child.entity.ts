import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Community } from './community.entity';
import { Message } from './message.entity';
import { Nivo } from '../enums';
import { Base } from './base';

@Entity('children')
export class Child extends Base {
	@Column()
	first_name: string;

	@Column()
	last_name: string;

	@Column({ type: 'enum', enum: Nivo })
	nivo: Nivo;

	@ManyToMany(() => User, user => user.children)
	parents: User[];

	@ManyToOne(() => Community, community => community.users)
	community: Community;

	@OneToMany(() => Message, message => message.child)
	messages: Message[];
}
