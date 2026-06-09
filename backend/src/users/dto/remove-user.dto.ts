import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RemoveUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Senha não pode ser vazia.' })
  password?: string;
}
