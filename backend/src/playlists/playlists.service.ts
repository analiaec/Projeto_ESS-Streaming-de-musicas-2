import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(createPlaylistDto: CreatePlaylistDto) {
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
    Object.assign(playlist, updatePlaylistDto);
    return this.playlistRepository.save(playlist);
  }

  async remove(id: number) {
    const playlist = await this.findOne(id);
    await this.playlistRepository.remove(playlist);
    return playlist;
  }
}
