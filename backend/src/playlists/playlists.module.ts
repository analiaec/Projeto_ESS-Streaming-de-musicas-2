import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistsService } from './playlists.service';
import { PlaylistsController } from './playlists.controller';
import { Playlist } from './playlist.entity';
import { Musica } from '../musicas/musica.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Playlist, Musica])],
  controllers: [PlaylistsController],
  providers: [PlaylistsService],
})
export class PlaylistsModule {}
