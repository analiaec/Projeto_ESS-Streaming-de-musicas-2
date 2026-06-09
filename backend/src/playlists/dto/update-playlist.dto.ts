import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class UpdatePlaylistDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  nome?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  descricao?: string;

  @IsOptional()
  @IsBoolean()
  publica?: boolean;

  @IsOptional()
  @IsString()
  categoria?: string;
}
