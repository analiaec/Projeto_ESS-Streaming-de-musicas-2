import { Module }       from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Score }         from './score.entity';
import { Musica }        from '../musicas/musica.entity';
import { ScoresService } from './score.service';
import { PlaybackModule } from '../playback/playback.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Score, Musica]),
    PlaybackModule,
  ],
  providers: [ScoresService],
  exports:   [ScoresService],
})
export class ScoresModule {}