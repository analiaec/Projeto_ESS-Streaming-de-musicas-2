import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePodcastDto {
  @IsString()
  @MinLength(3, { message: 'Login deve ter pelo menos 3 caracteres.' })
  @MaxLength(30, { message: 'Login não pode ter mais de 30 caracteres.' })
  login: string;

  @IsString()
  @MinLength(1, { message: 'Nome não pode estar vazio.' })
  @MaxLength(60, { message: 'Nome não pode ter mais de 60 caracteres.' })
  name: string;

  @IsString()
  @MinLength(3, { message: 'Senha deve ter pelo menos 3 caracteres.' })
  @MaxLength(60, { message: 'Senha não pode ter mais de 60 caracteres.' })
  password: string;

  @IsEmail({}, { message: 'E-mail inválido.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Descrição é obrigatória.' })
  descricao: string;
}
