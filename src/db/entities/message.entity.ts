import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Child } from './child.entity';
import { Base } from './base';

@Entity('messages')
export class Message extends Base {
	@Column()
	content: string;

	@ManyToOne(() => User, (user) => user.messages)
	sender: User;

	@ManyToOne(() => Child, (child) => child.messages)
	child: Child;
}
