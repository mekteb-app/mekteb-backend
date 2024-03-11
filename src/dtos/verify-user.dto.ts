import { IsString, MinLength } from 'class-validator';

export class VerifyUserDto {
	@IsString()
	@MinLength(10, { message: 'Invalid token' })
	public token: string;

	@IsString({ message: 'Password is required' })
	public password: string;

	@IsString({ message: 'Confirm password is required' })
	public confirmPassword: string;
}
