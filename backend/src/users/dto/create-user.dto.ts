import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length, ValidateIf, MinLength, MaxLength} from "class-validator";
import { UserRole } from "../entities/user.entity";

export class CreateUserDto {
   @IsString()
   @MinLength(3, {message: 'O login deve ter pelo menos 3 caracteres. Construa outro login.',})
   @MaxLength(20, {message: 'O login não pode ter mais de 20 caracteres.'})
   @IsNotEmpty({message: 'O campo login não pode estar vazio.'})
   "login": string;
   @IsString()
   @MinLength(1, {message: 'O nome deve ter pelo menos 1 caractere. Construa outro nome.',})
   @MaxLength(50, {message: 'O nome não pode ter mais de 50 caracteres.'})
   @IsNotEmpty({message: 'O campo nome não pode estar vazio.'})
   "name": string;
   @IsString()
   @MinLength(3, {message: 'A senha deve ter pelo menos 3 caracteres. Construa outra senha.',})
   @MaxLength(20, {message: 'A senha não pode ter mais de 20 caracteres.'})
   @IsNotEmpty({message: 'O campo senha não pode estar vazio.'})
   "password": string;
   @IsEmail({require_tld: true}, {message: 'Voce deve inserir um e-mail válido para realizar o cadastro. Coloque outro e-mail.'})
   @IsNotEmpty({message: 'O campo email não pode estar vazio.'})
   "email": string;
   @IsEnum(UserRole, {message: 'O tipo de conta informado deve ser válido.',})
   @IsNotEmpty({message: 'O campo tipodeconta não pode estar vazio.'})
   "tipodeconta": UserRole;
   /* @ValidateIf(
    (user) => user.accountType === UserRole.ARTISTA || user.accountType === UserRole.PODCAST,)
    @IsString()
    @IsNotEmpty()
    "description"?: string; */
}