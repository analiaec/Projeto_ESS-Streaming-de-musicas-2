import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PodcastService } from './podcast.service';
import { PodcastController } from './podcast.controller';
import { Podcast } from './entities/podcast.entity';
import { Episode } from '../episodes/entities/episode.entity';
import { User } from '../users/entities/user.entity';
import { Artista } from '../artistas/artista.entity';

@Module({
  // esse modulo registra as entidades que o podcast service usa
  imports: [TypeOrmModule.forFeature([Podcast, Episode, User])],
  controllers: [PodcastController],
  providers: [PodcastService],
})
export class PodcastModule {}
