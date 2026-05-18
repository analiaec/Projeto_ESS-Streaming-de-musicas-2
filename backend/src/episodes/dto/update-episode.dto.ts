import {IsString, IsOptional,} from 'class-validator';

export class UpdateEpisodeDto {

  @IsString()
  @IsOptional()
  titulo?: string;
}