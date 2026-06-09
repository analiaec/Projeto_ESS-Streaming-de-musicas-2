import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './album.entity';
import { AlbunsController } from './albuns.controller';
import { AlbunsService } from './albuns.service';

@Module({
  imports: [TypeOrmModule.forFeature([Album])],
  controllers: [AlbunsController],
  providers: [AlbunsService],
  exports: [AlbunsService],
})
export class AlbunsModule {}
