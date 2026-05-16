import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length, ValidateIf,} from "class-validator";
import { UserRole } from "../entities/user.entity";
//dto e data transfer objects
//nao precisa fazer nada com UpdateUserDto porque ele extende do CreateUserDto
export class CreateUserDto { //nao tem id porque so cria um id depois
   @IsString()
   @Length(3,20)
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
   /*
   @IsEnum(["INTERN", "ENGINEER" , "ADMIN"], {
    message: 'Valid role required' //mensagem se nao for papel valido, tem que usar , no array
   })
   "role": "INTERN" | "ENGINEER" | "ADMIN";*/
}