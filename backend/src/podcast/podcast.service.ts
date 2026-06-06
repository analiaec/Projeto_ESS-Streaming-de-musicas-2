import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePodcastDto } from './dto/create-podcast.dto';
import { CreatePodcastEpisodeDto } from './dto/create-podcast-episode.dto';
import { UpdatePodcastDto } from './dto/update-podcast.dto';
import { UpdatePodcastEpisodeDto } from './dto/update-podcast-episode.dto';
import { Repository } from 'typeorm';
import { Podcast } from './entities/podcast.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { Episode } from '../episodes/entities/episode.entity';

@Injectable()
export class PodcastService {
  // esses repositosrios conectam podcaster, episodio e usuario
  constructor(
    @InjectRepository(Podcast)
    private readonly podcastRepository: Repository<Podcast>,
    @InjectRepository(Episode)
    private readonly episodeRepository: Repository<Episode>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createPodcastDto: CreatePodcastDto) {
    // aqui cria um novo podcaster (artista que publica podcast)
    const existingLogin = await this.userRepository.findOneBy({ login: createPodcastDto.login });
    if (existingLogin) {
      throw new BadRequestException('Login ja existe');
    }

    const podcast = this.podcastRepository.create({
      ...createPodcastDto,
      tipodeconta: UserRole.PODCASTER,
    });

    return this.podcastRepository.save(podcast);
  }

  findAll() {
    // esse lista todos os perfis de podcaster
    return this.podcastRepository.find();
  }

  async findOne(login: string) {
    // aqui busca um podcaster pelo login
    const podcast = await this.podcastRepository.findOne({
      where: { login },
    });

    if (!podcast) {
      throw new NotFoundException('Podcaster nao encontrado');
    }

    return podcast;
  }

  async update(login: string, updatePodcastDto: UpdatePodcastDto) {
    // esse atualiza os dados sem guardar historico
    const podcast = await this.findOne(login);

    Object.assign(podcast, updatePodcastDto);
    podcast.tipodeconta = UserRole.PODCASTER;
    return this.podcastRepository.save(podcast);
  }

  async remove(login: string) {
    // esse remove o perfil de podcaster
    const podcast = await this.findOne(login);
    return this.podcastRepository.remove(podcast);
  }

  private parseScheduledDate(dateText?: string): Date | null {
    // esse helper valida a data de postagem agendada
    if (!dateText) {
      return null;
    }

    const parsed = new Date(dateText);
    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException('Data de publicacao agendada invalida');
    }

    return parsed;
  }

  private async findEpisodeOwnedByPodcast(login: string, episodeId: number): Promise<Episode> {
    // esse checa se o episodio realmente e desse podcaster
    const episode = await this.episodeRepository.findOne({
      where: { id: episodeId },
      relations: ['podcast'],
    });

    if (!episode) {
      throw new NotFoundException('Episodio nao encontrado');
    }

    if (!episode.podcast || episode.podcast.login !== login) {
      throw new ForbiddenException('Episodio nao pertence ao podcast informado');
    }

    return episode;
  }

  private async publishScheduledEpisodes(login?: string) {
    // esse publica automaticamente episodios que ja passaram da data agendada
    const query = this.episodeRepository
      .createQueryBuilder('episode')
      .innerJoinAndSelect('episode.podcast', 'podcast')
      .where('episode.publicado = false')
      .andWhere('episode.dataPublicacaoAgendada IS NOT NULL')
      .andWhere('episode.dataPublicacaoAgendada <= :agora', { agora: new Date() });

    if (login) {
      query.andWhere('podcast.login = :login', { login });
    }

    const pending = await query.getMany();
    if (!pending.length) {
      return;
    }

    for (const episode of pending) {
      episode.publicado = true;
      episode.publicadoEm = episode.dataPublicacaoAgendada ?? new Date();
    }

    await this.episodeRepository.save(pending);
  }

  async createEpisode(login: string, dto: CreatePodcastEpisodeDto) {
    // essa cria episodio e ja decide se publica agora ou deixa agendado
    const podcast = await this.findOne(login);
    const scheduledDate = this.parseScheduledDate(dto.dataPublicacaoAgendada);
    const hasFutureSchedule = !!scheduledDate && scheduledDate.getTime() > Date.now();

    const episode = this.episodeRepository.create({
      titulo: dto.titulo,
      podcast,
      arquivoUrl: dto.arquivoUrl,
      dataPublicacaoAgendada: scheduledDate,
      publicado: !hasFutureSchedule,
      publicadoEm: hasFutureSchedule ? null : new Date(),
    });

    return this.episodeRepository.save(episode);
  }

  async updateEpisode(login: string, episodeId: number, dto: UpdatePodcastEpisodeDto) {
    // essa atualiza episodio sem versionamento antigo
    const episode = await this.findEpisodeOwnedByPodcast(login, episodeId);

    if (dto.titulo !== undefined) {
      episode.titulo = dto.titulo;
    }

    if (dto.arquivoUrl !== undefined) {
      episode.arquivoUrl = dto.arquivoUrl;
    }

    if (dto.dataPublicacaoAgendada !== undefined) {
      const scheduledDate = this.parseScheduledDate(dto.dataPublicacaoAgendada);
      const hasFutureSchedule = !!scheduledDate && scheduledDate.getTime() > Date.now();
      episode.dataPublicacaoAgendada = scheduledDate;
      episode.publicado = !hasFutureSchedule;
      episode.publicadoEm = hasFutureSchedule ? null : scheduledDate ?? new Date();
    }

    return this.episodeRepository.save(episode);
  }

  async removeEpisode(login: string, episodeId: number) {
    // essa deleta episodio do podcast
    const episode = await this.findEpisodeOwnedByPodcast(login, episodeId);
    return this.episodeRepository.remove(episode);
  }

  async findPublishedEpisodes(login: string) {
    // essa lista so episodios ja publicados para o publico
    await this.findOne(login);
    await this.publishScheduledEpisodes(login);

    return this.episodeRepository.find({
      where: {
        publicado: true,
        podcast: { login },
      },
      relations: ['podcast'],
      order: {
        publicadoEm: 'DESC',
        id: 'DESC',
      },
    });
  }

  async registrarAcesso(episodeId: number) {
    // essa conta acesso quando a reproducao comeca
    await this.publishScheduledEpisodes();

    const episode = await this.episodeRepository.findOne({
      where: { id: episodeId, publicado: true },
      relations: ['podcast'],
    });

    if (!episode) {
      throw new NotFoundException('Episodio nao encontrado ou ainda nao publicado');
    }

    await this.episodeRepository.increment({ id: episodeId }, 'reproducoes', 1);

    const updated = await this.episodeRepository.findOneBy({ id: episodeId });
    return {
      episodeId,
      podcastLogin: episode.podcast.login,
      reproducoes: updated?.reproducoes ?? episode.reproducoes + 1,
    };
  }

  async totalAcessos(login: string) {
    // essa soma o total de acessos do podcast
    await this.findOne(login);
    await this.publishScheduledEpisodes(login);

    const raw = await this.episodeRepository
      .createQueryBuilder('episode')
      .select('COALESCE(SUM(episode.reproducoes), 0)', 'total')
      .innerJoin('episode.podcast', 'podcast')
      .where('podcast.login = :login', { login })
      .andWhere('episode.publicado = true')
      .getRawOne();

    return {
      podcastLogin: login,
      totalAcessos: Number(raw?.total ?? 0),
    };
  }

  async totalAcessosEpisodio(episodeId: number) {
    // essa soma o total de acessos de um episodio especifico
    const episode = await this.episodeRepository.findOne({
      where: { id: episodeId, publicado: true },
      relations: ['podcast'],
    });

    if (!episode) {
      throw new NotFoundException('Episodio nao encontrado ou ainda nao publicado');
    }

    return {
      episodeId,
      titulo: episode.titulo,
      podcastLogin: episode.podcast.login,
      totalAcessos: episode.reproducoes,
    };
  }

  async downloadEpisode(episodeId: number, requestLogin?: string) {
    // essa libera download so pra usuario logado no header x-user-login
    if (!requestLogin) {
      throw new UnauthorizedException('Download disponivel apenas para usuarios logados');
    }

    const user = await this.userRepository.findOneBy({ login: requestLogin });
    if (!user) {
      throw new UnauthorizedException('Usuario informado no header x-user-login nao existe');
    }

    await this.publishScheduledEpisodes();

    const episode = await this.episodeRepository.findOne({
      where: { id: episodeId, publicado: true },
      relations: ['podcast'],
    });

    if (!episode) {
      throw new NotFoundException('Episodio nao encontrado ou ainda nao publicado');
    }

    if (!episode.arquivoUrl) {
      throw new NotFoundException('Arquivo bruto do episodio nao cadastrado');
    }

    return {
      autorizadoParaDownload: true,
      solicitadoPor: user.login,
      episodeId: episode.id,
      titulo: episode.titulo,
      podcastLogin: episode.podcast.login,
      arquivoUrl: episode.arquivoUrl,
    };
  }
}
