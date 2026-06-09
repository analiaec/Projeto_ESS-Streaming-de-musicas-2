import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Senha é obrigatória.' })
  password: string;
}
