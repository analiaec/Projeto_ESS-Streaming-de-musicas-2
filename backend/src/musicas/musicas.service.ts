import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Musica } from './musica.entity';
import { NotFoundError } from 'rxjs';
import { Playback } from '../playback/entities/playback.entity';
import { PlaybackService } from '../playback/playback.service';

@Injectable()
export class MusicasService {

  constructor(
    @InjectRepository(Musica)
    private readonly musicaRepository: Repository<Musica>,
    private readonly playbackService: PlaybackService,
  ) {}

  async emAlta(): Promise<Musica[]> {
    return this.musicaRepository.find({order: {reproducoes : 'DESC', titulo: 'ASC'}, take:10, relations: ['artistas', 'album']});
  }
  async buscar(termo?: string, artista?: string, genero?: string, ano?: string): Promise <Musica[]> {
    const query = this.musicaRepository.createQueryBuilder('musica').leftJoinAndSelect('musica.artistas', 'artista').leftJoinAndSelect('musica.album', 'album');
    if(termo) {
        query.andWhere('LOWER(musica.titulo) LIKE LOWER(:termo)', {termo : '%' + termo + '%'});
        query.addSelect(`CASE WHEN LOWER(musica.titulo) = LOWER(:termoExato) THEN 1 ELSE 2 END `, 'relevancia').setParameter('termoExato', termo);
        query.orderBy('relevancia', 'ASC');
        query.addOrderBy('musica.reproducoes', 'DESC');
    } else {
        query.orderBy('musica.reproducoes', 'DESC');
    }
    if(genero) {
        query.andWhere('LOWER(musica.genero) = LOWER(:genero)', {genero : genero});
    }
    if(genero) {
        query.andWhere('LOWER(musica.genero) = LOWER(:genero)', {genero : genero});
    }
    if(artista) {
        query.andWhere('LOWER(artista.nomeArtistico) LIKE LOWER(:artista)', {artista : '%' + artista + '%'});
    }
    if(ano) {
        query.andWhere('musica.ano = :ano', {ano : parseInt(ano)});
    }
    query.limit(10);
    return query.getMany();

  }
  async registrarReproducoes(id: number, login: string): Promise<Musica> {
    const musica = await this.musicaRepository.findOneByOrFail({id});
    if(!musica){throw new NotFoundException('Musica nao encontrada');}
    await this.musicaRepository.increment({id}, 'reproducoes', 1);
    await this.playbackService.create({login, musicaid: id}) //cria o playback de acordo com o usuario que escutou a musica e o id da musica
    return musica;
  }
}