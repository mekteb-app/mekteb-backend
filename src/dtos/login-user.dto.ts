import { IsEmail, IsString } from 'class-validator';

export class LoginUserDto {
	@IsEmail()
	public email: string;

	@IsString({ message: 'Password is required' })
	public password: string;
}
