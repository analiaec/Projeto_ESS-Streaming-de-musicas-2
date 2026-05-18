import {IsString, IsNotEmpty, IsArray, ArrayNotEmpty,} from 'class-validator';

export class CreateProgramDto {

  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  generos: string[];
}