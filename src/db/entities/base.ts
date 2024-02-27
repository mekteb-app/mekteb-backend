import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class Base {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@CreateDateColumn({
		default: () => 'CURRENT_TIMESTAMP',
	})
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
