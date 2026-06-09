import { IsEnum, IsOptional, IsString, MinLength, MaxLength } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  "name"?: string;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'A senha deve ter pelo menos 3 caracteres. Construa outra senha.' })
  @MaxLength(20, { message: 'A senha não pode ter mais de 20 caracteres.' })
  "password"?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'O tipo de conta informado deve ser válido.' })
  "tipodeconta"?: UserRole;
}
