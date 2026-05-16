import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length, ValidateIf,} from "class-validator";
import { UserRole } from "../entities/user.entity";

export class CreateUserDto {
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
   "role": UserRole;
   /* @ValidateIf(
    (user) => user.accountType === UserRole.ARTISTA || user.accountType === UserRole.PODCAST,)
    @IsString()
    @IsNotEmpty()
    "description"?: string; */
}