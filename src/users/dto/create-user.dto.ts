import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { Role } from '../entities/user.entity';

export class CreateUserDto {
  @IsEmail() email: string;
  @IsString() @MinLength(8) password: string;
  @IsString() @MinLength(2) name: string;
  @IsEnum(Role) role: Role;
}