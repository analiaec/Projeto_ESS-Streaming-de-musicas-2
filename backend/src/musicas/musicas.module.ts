import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Musica } from './musica.entity';
import { MusicasService } from './musicas.service';
import { MusicasController } from './musicas.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Musica])
  ],
  providers: [MusicasService],
  controllers: [MusicasController],
  exports: [MusicasService],
})
export class MusicasModule {}