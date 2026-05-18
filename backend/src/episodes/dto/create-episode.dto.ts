import {IsString, IsNotEmpty,} from 'class-validator';

export class CreateEpisodeDto {

  @IsString()
  @IsNotEmpty()
  titulo: string;
}