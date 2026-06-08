import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playlist } from './playlist.entity';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private readonly playlistRepository: Repository<Playlist>,
  ) {}

  private async ensureNomeDisponivel(nome: string, ignoreId?: number) {
    const query = this.playlistRepository
      .createQueryBuilder('playlist')
      .where('LOWER(playlist.nome) = LOWER(:nome)', { nome });

    if (ignoreId !== undefined) {
      query.andWhere('playlist.id <> :ignoreId', { ignoreId });
    }

    const existente = await query.getOne();

    if (existente) {
      throw new ConflictException('Essa playlist já existe, escolha um novo nome');
    }
  }

  async create(createPlaylistDto: CreatePlaylistDto) {
    await this.ensureNomeDisponivel(createPlaylistDto.nome);
    const newPlaylist = this.playlistRepository.create(createPlaylistDto);
    return this.playlistRepository.save(newPlaylist);
  }

  findAll() {
    return this.playlistRepository.find();
  }

  async findOne(id: number) {
    const playlist = await this.playlistRepository.findOneBy({ id });
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
    return playlist;
  }

  async update(id: number, updatePlaylistDto: UpdatePlaylistDto) {
    const playlist = await this.findOne(id);

    if (updatePlaylistDto.nome && updatePlaylistDto.nome !== playlist.nome) {
      await this.ensureNomeDisponivel(updatePlaylistDto.nome, id);
    }

    Object.assign(playlist, updatePlaylistDto);
    return this.playlistRepository.save(playlist);
  }

  async remove(id: number) {
    const playlist = await this.findOne(id);
    await this.playlistRepository.remove(playlist);
    return playlist;
  }
}
