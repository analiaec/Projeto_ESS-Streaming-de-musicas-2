import { Module } from '@nestjs/common';
import { PlaybackService } from './playback.service';
import { PlaybackController } from './playback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playback } from './entities/playback.entity';
import { User } from '../users/entities/user.entity';
import { Musica } from '../musicas/musica.entity';
import { Episode } from '../episodes/entities/episode.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Playback,
    User,
    Musica,
    Episode,
  ]),],
  controllers: [PlaybackController],
  providers: [PlaybackService],
  exports:[PlaybackService],
})
export class PlaybackModule {}
