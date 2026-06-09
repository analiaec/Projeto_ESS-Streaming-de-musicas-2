import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playlist } from './playlist.entity';
import { Musica } from '../musicas/musica.entity';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private readonly playlistRepository: Repository<Playlist>,
    @InjectRepository(Musica)
    private readonly musicaRepository: Repository<Musica>,
  ) {}

  private async ensureNomeDisponivel(nome: string, ownerLogin: string, excludeId?: number) {
    const existente = await this.playlistRepository
      .createQueryBuilder('pl')
      .where('LOWER(pl.nome) = LOWER(:nome)', { nome })
      .andWhere('pl.ownerLogin = :ownerLogin', { ownerLogin })
      .getOne();
    if (existente && existente.id !== excludeId) {
      throw new ConflictException('Essa playlist já existe, escolha um novo nome.');
    }
  }

  async create(createPlaylistDto: CreatePlaylistDto) {
    await this.ensureNomeDisponivel(createPlaylistDto.nome, createPlaylistDto.ownerLogin);
    const newPlaylist = this.playlistRepository.create({
      ...createPlaylistDto,
      seguidores: [],
    });
    return this.playlistRepository.save(newPlaylist);
  }

  findAll() {
    return this.playlistRepository.find({ relations: ['musicas', 'musicas.album', 'musicas.artistas'] });
  }

  async findOne(id: number) {
    const playlist = await this.playlistRepository.findOne({
      where: { id },
      relations: ['musicas', 'musicas.album', 'musicas.artistas'],
    });
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
    return playlist;
  }

  async update(id: number, updatePlaylistDto: UpdatePlaylistDto) {
    const playlist = await this.findOne(id);
    if (updatePlaylistDto.nome) {
      await this.ensureNomeDisponivel(updatePlaylistDto.nome, playlist.ownerLogin, id);
    }
    Object.assign(playlist, updatePlaylistDto);
    return this.playlistRepository.save(playlist);
  }

  async remove(id: number) {
    const playlist = await this.findOne(id);
    await this.playlistRepository.remove(playlist);
    return playlist;
  }

  async adicionarMusica(playlistId: number, musicaId: number) {
    const playlist = await this.playlistRepository.findOne({
      where: { id: playlistId },
      relations: ['musicas'],
    });
    if (!playlist) throw new NotFoundException('Playlist não encontrada.');

    const musica = await this.musicaRepository.findOneBy({ id: musicaId });
    if (!musica) throw new NotFoundException('Música não encontrada.');

    const jaExiste = playlist.musicas.some(m => m.id === musicaId);
    if (!jaExiste) {
      playlist.musicas.push(musica);
      await this.playlistRepository.save(playlist);
    }
    return playlist;
  }

  async removerMusica(playlistId: number, musicaId: number) {
    const playlist = await this.playlistRepository.findOne({
      where: { id: playlistId },
      relations: ['musicas'],
    });
    if (!playlist) throw new NotFoundException('Playlist não encontrada.');

    playlist.musicas = playlist.musicas.filter(m => m.id !== musicaId);
    await this.playlistRepository.save(playlist);
    return playlist;
  }

  async seguir(playlistId: number, userLogin: string) {
    const playlist = await this.playlistRepository.findOneBy({ id: playlistId });
    if (!playlist) throw new NotFoundException('Playlist não encontrada.');

    const seguidores = playlist.seguidores ?? [];
    if (!seguidores.includes(userLogin)) {
      playlist.seguidores = [...seguidores, userLogin];
      await this.playlistRepository.save(playlist);
    }
    return { seguidores: playlist.seguidores };
  }

  async desseguir(playlistId: number, userLogin: string) {
    const playlist = await this.playlistRepository.findOneBy({ id: playlistId });
    if (!playlist) throw new NotFoundException('Playlist não encontrada.');

    playlist.seguidores = (playlist.seguidores ?? []).filter(l => l !== userLogin);
    await this.playlistRepository.save(playlist);
    return { seguidores: playlist.seguidores };
  }
}
