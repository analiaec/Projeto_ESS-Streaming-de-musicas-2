import { Module } from '@nestjs/common';
import { ProgramasService } from './programas.service';
import { ProgramasController } from './programas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Programa } from './entities/programa.entity';
import { Podcast } from '../podcast/entities/podcast.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Programa,Podcast])],
  controllers: [ProgramasController],
  providers: [ProgramasService],
})
export class ProgramasModule {}
