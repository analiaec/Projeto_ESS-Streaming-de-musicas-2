import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, In, Repository, MoreThan, Brackets } from 'typeorm';
import { Score }  from './score.entity';
import { Musica } from '../musicas/musica.entity';
import { User }   from '../users/entities/user.entity';
import { PlaybackService } from '../playback/playback.service';

@Injectable()
export class ScoresService {

  constructor(
    @InjectRepository(Score)
    private scoreRepository: Repository<Score>,

    @InjectRepository(Musica)
    private musicaRepository: Repository<Musica>,

    private playbackService: PlaybackService,
  ) {}

  async calcularScores(login: string): Promise<void> {

    // 1. busca o histórico do usuário
    let historico: any[] = [];
    try {
      historico = await this.playbackService.findByUser(login);
    } catch {
      historico = [];
    }

    const musicasOuvidas = historico
      .filter(p => p.musica)
      .map(p => p.musica.id);

    const totalUsuario = historico.filter(p => p.musica).length;

    // sem histórico — limpa scores e retorna
    if (totalUsuario === 0) {
      await this.scoreRepository.delete({ user: { login } as User });
      return;
    }

    // 2. conta reproduções por gênero do usuário
    const reproducoesPorGenero: Record<string, number> = {};
    historico
      .filter(p => p.musica)
      .forEach(p => {
        const genero = p.musica.genero;
        reproducoesPorGenero[genero] =
          (reproducoesPorGenero[genero] ?? 0) + 1;
      });

    // 3. conta reproduções por artista do usuário
    const reproducoesPorArtista: Record<string, number> = {};
    historico
      .filter(p => p.musica && p.musica.artistas)
      .forEach(p => {
        p.musica.artistas.forEach((artista: any) => {
          const nome = artista.nomeArtistico;
          reproducoesPorArtista[nome] =
            (reproducoesPorArtista[nome] ?? 0) + 1;
        });
      });

    // 4. busca músicas com afinidade — mesmo gênero OU mesmo artista
    const generosOuvidos  = Object.keys(reproducoesPorGenero);
    const artistasOuvidos = Object.keys(reproducoesPorArtista);

    let musicasDisponiveis: Musica[] = [];

    if (generosOuvidos.length === 0 && artistasOuvidos.length === 0) {
    // sem afinidade — não recomenda nada
    musicasDisponiveis = [];
    } else {
    const query = this.musicaRepository
        .createQueryBuilder('musica')
        .leftJoinAndSelect('musica.artistas', 'artista');

    // exclui músicas já ouvidas
    if (musicasOuvidas.length > 0) {
        query.where('musica.id NOT IN (:...musicasOuvidas)', { musicasOuvidas });
    }

    // filtra por gênero OU artista — só adiciona condições se os arrays não estão vazios
    query.andWhere(
        new Brackets(qb => {
        if (generosOuvidos.length > 0 && artistasOuvidos.length > 0) {
            qb.where('musica.genero IN (:...generosOuvidos)', { generosOuvidos })
            .orWhere('artista.nomeArtistico IN (:...artistasOuvidos)', { artistasOuvidos });
        } else if (generosOuvidos.length > 0) {
            qb.where('musica.genero IN (:...generosOuvidos)', { generosOuvidos });
        } else {
            qb.where('artista.nomeArtistico IN (:...artistasOuvidos)', { artistasOuvidos });
        }
        })
    );

    musicasDisponiveis = await query.getMany();
    }

    // 5. calcula score para cada música disponível
    const scores = musicasDisponiveis.map(musica => {

      // fator 1 — afinidade de gênero
      const repGenero = reproducoesPorGenero[musica.genero] ?? 0;
      const fator1 = repGenero / totalUsuario;

      // fator 2 — afinidade com o artista
      const repArtistas = musica.artistas.reduce((acc, artista) => {
        return acc + (reproducoesPorArtista[artista.nomeArtistico] ?? 0);
      }, 0);
      const fator2 = repArtistas / totalUsuario;

      // score normalizado entre 0 e 1
      const scoreValor = (fator1 + fator2) / 2;

      return { musica, scoreValor };
    });

    // 6. remove scores antigos do usuário
    await this.scoreRepository.delete({ user: { login } as User });

    // 7. salva os novos scores
    const user = { login } as User;
    await this.scoreRepository.save(
      scores.map(({ musica, scoreValor }) => ({
        user,
        musica,
        score: scoreValor,
      }))
    );
  }

  async getRecomendacoes(login: string): Promise<Score[]> {
    return this.scoreRepository.find({
      where: {
        user:  { login } as User,
        score: MoreThan(0),
      },
      relations: ['musica', 'musica.artistas', 'musica.album'],
      order: { score: 'DESC' },
      take: 10,
    });
  }

  async removerMusicaRecomendada(login: string, musicaId: number): Promise<void> {
    await this.scoreRepository.delete({
      user:   { login } as User,
      musica: { id: musicaId } as Musica,
    });
  }
}