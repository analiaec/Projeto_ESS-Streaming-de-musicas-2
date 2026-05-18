import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { PodcastService } from './podcast.service';
import { CreatePodcastDto } from './dto/create-podcast.dto';
import { UpdatePodcastDto } from './dto/update-podcast.dto';
import { CreatePodcastEpisodeDto } from './dto/create-podcast-episode.dto';
import { UpdatePodcastEpisodeDto } from './dto/update-podcast-episode.dto';

@Controller('podcast')
export class PodcastController {
  constructor(private readonly podcastService: PodcastService) {}

  // essa rota cria o perfil de podcast
  @Post()
  create(@Body() createPodcastDto: CreatePodcastDto) {
    return this.podcastService.create(createPodcastDto);
  }

  // essa rota lista todos os podcasts
  @Get()
  findAll() {
    return this.podcastService.findAll();
  }

  // essa rota cria episodio do podcast
  @Post(':login/episodes')
  createEpisode(
    @Param('login') login: string,
    @Body() createPodcastEpisodeDto: CreatePodcastEpisodeDto,
  ) {
    return this.podcastService.createEpisode(login, createPodcastEpisodeDto);
  }

  // essa rota atualiza episodio do podcast
  @Patch(':login/episodes/:episodeId')
  updateEpisode(
    @Param('login') login: string,
    @Param('episodeId', ParseIntPipe) episodeId: number,
    @Body() updatePodcastEpisodeDto: UpdatePodcastEpisodeDto,
  ) {
    return this.podcastService.updateEpisode(login, episodeId, updatePodcastEpisodeDto);
  }

  // essa rota deleta episodio do podcast
  @Delete(':login/episodes/:episodeId')
  removeEpisode(
    @Param('login') login: string,
    @Param('episodeId', ParseIntPipe) episodeId: number,
  ) {
    return this.podcastService.removeEpisode(login, episodeId);
  }

  // essa rota lista episodios publicados
  @Get(':login/episodes')
  findPublishedEpisodes(@Param('login') login: string) {
    return this.podcastService.findPublishedEpisodes(login);
  }

  // essa rota registra 1 acesso ao iniciar reproducao
  @Post('episodes/:episodeId/play')
  registrarAcesso(@Param('episodeId', ParseIntPipe) episodeId: number) {
    return this.podcastService.registrarAcesso(episodeId);
  }

  // essa rota mostra o total de acessos do podcaster
  @Get(':login/acessos-total')
  totalAcessos(@Param('login') login: string) {
    return this.podcastService.totalAcessos(login);
  }

  // essa rota mostra o total de acessos de um episodio
  @Get('episodes/:episodeId/acessos')
  totalAcessosEpisodio(@Param('episodeId', ParseIntPipe) episodeId: number) {
    return this.podcastService.totalAcessosEpisodio(episodeId);
  }

  // essa rota valida login e retorna o arquivo bruto para download
  @Get('episodes/:episodeId/download')
  downloadEpisode(
    @Param('episodeId', ParseIntPipe) episodeId: number,
    @Headers('x-user-login') requestLogin?: string,
  ) {
    return this.podcastService.downloadEpisode(episodeId, requestLogin);
  }

  // essa rota busca dados de 1 podcaster
  @Get(':login')
  findOne(@Param('login') login: string) {
    return this.podcastService.findOne(login);
  }

  // essa rota atualiza o podcaster
  @Patch(':login')
  update(@Param('login') login: string, @Body() updatePodcastDto: UpdatePodcastDto) {
    return this.podcastService.update(login, updatePodcastDto);
  }

  // essa rota remove o podcaster
  @Delete(':login')
  remove(@Param('login') login: string) {
    return this.podcastService.remove(login);
  }
}
