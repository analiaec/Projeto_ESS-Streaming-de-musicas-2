import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class CreatePlaylistDto {
  @IsString()
  @Length(1, 100)
  nome: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  descricao?: string;

  @IsOptional()
  @IsBoolean()
  publica?: boolean;

  @IsString()
  @Length(3, 20)
  ownerLogin: string;
}
