import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProgramaDto } from './dto/create-programa.dto';
import { UpdateProgramaDto } from './dto/update-programa.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Programa } from './entities/programa.entity';
import { Podcast } from '../podcast/entities/podcast.entity';

@Injectable()
export class ProgramasService {

  constructor(
    @InjectRepository(Programa)
    private programRepository: Repository<Programa>,
    @InjectRepository(Podcast)
    private podcastRepository: Repository<Podcast>,
  ){}

  async create(login:string, createProgramaDto: CreateProgramaDto) {
  const podcast = await this.podcastRepository.findOne({where: { login },});
  if (!podcast) {throw new NotFoundException('Podcast nao encontrado');}
  const program = this.programRepository.create({nome: createProgramaDto.nome, generos: createProgramaDto.generos, podcast, });
  return this.programRepository.save(program);
  }

  async findAll() {
    return this.programRepository.find({relations: ['podcast'],});
  }

  async findOne(id: number) {
  const program = await this.programRepository.findOne({where: { id },relations: ['podcast', 'episodes'],});
  if (!program) {throw new NotFoundException('Programa nao encontrado');}
  return program;
  }

  async update(id: number, updateProgramaDto: UpdateProgramaDto) {
  const program = await this.programRepository.findOne({where: {id}, });
  if (!program) {throw new NotFoundException('Programa nao encontrado');}
  Object.assign(program, updateProgramaDto);
  return this.programRepository.save(program);
  }

  async remove(id: number) {
    const program = await this.programRepository.findOne({where:{id},});
    if (!program) {throw new NotFoundException('Programa nao encontrado');}
    return this.programRepository.remove(program);
  }

  async findpod(login: string){
    const podcast = await this.podcastRepository.findOne({where:{login},});
    if(!podcast){throw new NotFoundException('Podcast nao encontrado');}
    return this.programRepository.find({where:{podcast:{login}}, relations:['podcast'],});
  }

}
