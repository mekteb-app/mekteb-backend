import {
	IsArray,
	IsDateString,
	IsEmail,
	IsEnum,
	IsOptional,
	IsPhoneNumber,
	IsString,
} from 'class-validator';
import { Roles } from '../db/enums';
import { CreateChildDto } from './create-child.dto';

export class CreateUserDto {
	@IsEmail({}, { message: 'Invalid email format' })
	public email: string;

	@IsString({ message: 'Invalid first name' })
	public first_name: string;

	@IsString({ message: 'Invalid last name' })
	public last_name: string;

	@IsDateString({}, { message: 'Invalid birthdate' })
	public birthdate: string;

	@IsPhoneNumber(null, { message: 'Invalid phone number' })
	public phone: string;

	@IsString({ message: 'Invalid community ID' })
	public communityId: string;

	@IsEnum(Roles)
	public role: Roles;

	@IsArray()
	@IsOptional()
	public childrenIds: string[];

	@IsArray()
	@IsOptional()
	public newChildren: CreateChildDto[];
}
