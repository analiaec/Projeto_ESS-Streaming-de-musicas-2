import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreatePodcastDto {
	// login do podcaster
	@IsString()
	@Length(3, 20)
	login: string;

	// nome visivel no perfil
	@IsString()
	@Length(1, 50)
	name: string;

	// senha do podcaster
	@IsString()
	@Length(3, 20)
	password: string;

	// email de acesso
	@IsEmail()
	email: string;

	// descricao do canal
	@IsString()
	@IsNotEmpty()
	descricao: string;
}
