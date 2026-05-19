import {IsEmail,IsEnum,Length,IsString,} from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';
export class RegisterDto {

  @IsString()
  @Length(3,20) //depois implementar os message.
  "login": string;
  @IsString()
  @Length(1, 50)
  "name": string;
  @IsString()
  @Length(3, 20)
  "password": string;
  @IsEmail()
  "email": string;
  @IsEnum(UserRole)
  "tipodeconta": UserRole;
}