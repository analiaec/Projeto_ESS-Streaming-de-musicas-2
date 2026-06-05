import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
   @IsString()
   @MinLength(3, {message: 'O login deve ter pelo menos 3 caracteres. Construa outro login.',})
   @MaxLength(20, {message: 'O login não pode ter mais de 20 caracteres.'})
   @IsNotEmpty({message: 'O campo login não pode estar vazio.'})
   "login": string;

   @IsString()
   @MinLength(3, {message: 'A senha deve ter pelo menos 3 caracteres. Construa outra senha.',})
   @MaxLength(20, {message: 'A senha não pode ter mais de 20 caracteres.'})
   @IsNotEmpty({message: 'O campo senha não pode estar vazio.'})
   "password": string;
}