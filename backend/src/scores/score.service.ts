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

    //  busca o histórico do usuário
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

    //  conta reproduções por gênero do usuário
    // normaliza pelo número de gêneros para evitar dupla contagem
    const reproducoesPorGenero: Record<string, number> = {};
    historico
      .filter(p => p.musica && p.musica.album?.generos?.length > 0)
      .forEach(p => {
        const generos: string[] = p.musica.album.generos;
        const peso = 1 / generos.length; // ← peso dividido entre os gêneros
        generos.forEach(genero => {
          reproducoesPorGenero[genero] =
            (reproducoesPorGenero[genero] ?? 0) + peso;
        });
      });

    //  conta reproduções por artista do usuário
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

    //  busca músicas com afinidade — mesmo gênero OU mesmo artista
    const generosOuvidos  = Object.keys(reproducoesPorGenero);
    const artistasOuvidos = Object.keys(reproducoesPorArtista);

    let musicasDisponiveis: Musica[] = [];

    if (generosOuvidos.length === 0 && artistasOuvidos.length === 0) {
      musicasDisponiveis = [];
    } else {
      const query = this.musicaRepository
        .createQueryBuilder('musica')
        .leftJoinAndSelect('musica.artistas', 'artista')
        .leftJoinAndSelect('musica.album', 'album');

      // exclui músicas já ouvidas
      if (musicasOuvidas.length > 0) {
        query.where('musica.id NOT IN (:...musicasOuvidas)', { musicasOuvidas });
      }

      // filtra por gênero OU artista
      query.andWhere(
        new Brackets(qb => {
          if (generosOuvidos.length > 0 && artistasOuvidos.length > 0) {
            qb.where('album.generos && ARRAY[:...generosOuvidos]', { generosOuvidos })
              .orWhere('artista.nomeArtistico IN (:...artistasOuvidos)', { artistasOuvidos });
          } else if (generosOuvidos.length > 0) {
            qb.where('album.generos && ARRAY[:...generosOuvidos]', { generosOuvidos });
          } else {
            qb.where('artista.nomeArtistico IN (:...artistasOuvidos)', { artistasOuvidos });
          }
        })
      );

      musicasDisponiveis = await query.getMany();
    }

    // calcula score para cada música disponível
    const scores = musicasDisponiveis.map(musica => {

      // fator 1 — afinidade de gênero
      // normaliza pelo número de gêneros da música para evitar dupla contagem
      const generosMusica = musica.album?.generos ?? [];
      const pesoGenero = generosMusica.length > 0 ? 1 / generosMusica.length : 0;
      const repGenero = generosMusica.reduce((acc: number, g: string) => {
        return acc + (reproducoesPorGenero[g] ?? 0) * pesoGenero;
      }, 0);
      const fator1 = repGenero / totalUsuario;

      // fator 2 — afinidade com o artista
      const repArtistas = musica.artistas.reduce((acc, artista) => {
        return acc + (reproducoesPorArtista[artista.nomeArtistico] ?? 0);
      }, 0);
      const fator2 = repArtistas / totalUsuario;

      // score normalizado entre 0 e 1
      const scoreValor = Math.round(((fator1 + fator2) / 2) * 100) / 100;

      return { musica, scoreValor };
    });

    // remove scores antigos do usuário
    await this.scoreRepository.delete({ user: { login } as User });

    // salva os novos scores
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