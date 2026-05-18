import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Musica } from './musica.entity';
import { MusicasService } from './musicas.service';
import { MusicasController } from './musicas.controller';
import { PlaybackModule } from '../playback/playback.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Musica]),
    PlaybackModule
  ],
  providers: [MusicasService],
  controllers: [MusicasController],
  exports: [MusicasService],
})
export class MusicasModule {}