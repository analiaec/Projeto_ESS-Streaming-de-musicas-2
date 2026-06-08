import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreatePodcastEpisodeDto {
  @IsString()
  @IsNotEmpty({ message: 'Título é obrigatório.' })
  titulo: string;

  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'arquivoUrl deve ser uma URL válida.' })
  arquivoUrl?: string;

  @IsOptional()
  @IsDateString()
  dataPublicacaoAgendada?: string;
}
