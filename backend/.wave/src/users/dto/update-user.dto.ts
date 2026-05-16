import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { UserRole } from '../entities/user.entity';
export class UpdateUserDto {
  @IsOptional() //se o campo vier, valide, senao ignore
  @IsString()
  @Length(1, 50)
  "name"?: string;

  @IsOptional()
  @IsString()
  @Length(3, 20)
  "password"?: string;

  @IsOptional()
  @IsEnum(UserRole)
  "accountType" ?: UserRole;
}
