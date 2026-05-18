import {IsString, IsNotEmpty, IsArray, ArrayNotEmpty,} from 'class-validator';

export class CreateProgramaDto {

  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  generos: string[];
}