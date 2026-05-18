import { IsDateString, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreatePodcastEpisodeDto {
  // titulo do episodio
  @IsString()
  @IsNotEmpty()
  titulo: string;

  // precisa ser arquivo de audio
  @IsString()
  @IsNotEmpty()
  @Matches(/\.(mp3|wav|m4a)$/i, {
    message: 'arquivoUrl deve apontar para um arquivo de audio valido',
  })
  arquivoUrl: string;

  // se mandar essa data, vira post agendado
  @IsOptional()
  @IsDateString()
  dataPublicacaoAgendada?: string;
}
