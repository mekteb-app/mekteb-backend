import { Column, Entity, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { Community } from './community.entity';
import { Child } from './child.entity';
import { Base } from './base';

@Entity('messages')
export class Message extends Base {
	@Column()
	content: string;

	@OneToOne(() => Community, community => community.children)
	community: Community;

	@OneToOne(() => User, user => user.messages)
	sender: User;

	@OneToOne(() => Child, child => child.messages)
	child: Child;
}
