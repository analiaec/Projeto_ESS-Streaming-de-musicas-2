import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class BuscarMusicaDto {

  @IsOptional()
  @IsString()
  termo?: string;

  @IsOptional()
  @IsString()
  artista?: string;

  @IsOptional()
  @IsString()
  genero?: string;

  @IsOptional()
  @IsNumberString()
  ano?: string;
}