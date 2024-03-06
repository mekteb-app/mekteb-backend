import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { Nivo } from '../db/enums';

export class CreateChildDto {
	@IsString()
	first_name: string;

	@IsString()
	last_name: string;

	@IsDateString()
	birthdate: string;

	@IsEnum(Nivo)
	nivo: Nivo;

	@IsString()
	@IsOptional()
	communityId: string;
}
