import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlaybackDto } from './dto/create-playback.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Playback } from './entities/playback.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Musica } from '../musicas/musica.entity';
import { Episode } from '../episodes/entities/episode.entity';

@Injectable()
export class PlaybackService {

  constructor(
    @InjectRepository(Playback)
    private playbackRepository: Repository<Playback>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Musica)
    private musicRepository: Repository<Musica>,
    @InjectRepository(Episode)
    private episodeRepository: Repository<Episode>
  ) {}

  async create(createPlaybackDto: CreatePlaybackDto) {
    const {login, musicaid, episodeid} = createPlaybackDto; //pega os dados do dto
    if(!musicaid && !episodeid){throw new BadRequestException('Informe uma música ou episódio',);} //tem que ter uma musica ou episodio
    if(musicaid && episodeid){throw new BadRequestException('O playback deve possuir apenas música OU episódio',);} //nao pode mandar os dois
    const user = await this.userRepository.findOne({where: {login}}); //verifica se o usuario existe
    if(!user) {throw new NotFoundException('Usuario nao encontrado');}
    const playback = new Playback(); //cria playback
    playback.user = user; //associa esse playback ao usuario
    if(musicaid){
      const music = await this.musicRepository.findOne({where: { id: musicaid },}); //verifica se a musica existe
      if (!music) {throw new NotFoundException('Música não encontrada');}
      playback.musica = music; //associa esse playback com a musica
    }
    if(episodeid){
      const episode = await this.episodeRepository.findOne({where: {id: episodeid}});
      if(!episode){throw new NotFoundException('Episódio nao encontrado');}
      playback.episode = episode;
    }

    const userPlaybacks = await this.playbackRepository.find({where: {user: {login: login}}, order: {horario: 'ASC'},});
    if(userPlaybacks.length >= 40){await this.playbackRepository.remove(userPlaybacks[0]);}

    return this.playbackRepository.save(playback);
  }

  async findAll() {
  return this.playbackRepository.find({relations: ['user', 'musica', 'episode'], order: { horario: 'DESC' },});
  }

  async findOne(login: string, id: number) {
    const playback = await this.playbackRepository.findOne({where: {id, user: {login},}, relations: ['musica', 'episode']})
    if(!playback){throw new NotFoundException('Playback nao encontrado',);}
    return playback;
  }

  async findByUser(login: string) {
    const user = await this.userRepository.findOne({ where: { login } });
    if (!user) { throw new NotFoundException('Usuario nao encontrado'); }
    const playback = await this.playbackRepository.find({
      where: { user },
      relations: ['musica', 'musica.artistas', 'musica.album', 'episode'],
      order: { horario: 'DESC' },
    });
    if (playback.length === 0) { throw new NotFoundException('Playback nao encontrado'); }
    return playback;
  }

  async findbytype(login: string, type: 'music' | 'episode', id?: number) {
    const user = await this.userRepository.findOne({ where: { login } });
    if (!user) { throw new NotFoundException('Usuario nao encontrado'); }
    const wherecondition: any = { user };
    if (type !== 'music' && type !== 'episode') { throw new BadRequestException('O tipo deve ser obrigatoriamente musica ou episodio.'); }
    if (type === 'music') { wherecondition.musica = Not(IsNull()); }
    else { wherecondition.episode = Not(IsNull()); }
    if (id) { wherecondition.id = id; }
    const playback = await this.playbackRepository.find({
      where: wherecondition,
      relations: ['musica', 'musica.artistas', 'musica.album', 'episode'],
      order: { horario: 'DESC' },
    });
    if (playback.length === 0) { throw new NotFoundException('Playback nao encontrado'); }
    return playback;
  }

}
