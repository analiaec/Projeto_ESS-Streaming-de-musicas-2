import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ProgramasService } from './programas.service';
import { CreateProgramaDto } from './dto/create-programa.dto';
import { UpdateProgramaDto } from './dto/update-programa.dto';

@Controller('podcast/:login/programs')
export class ProgramasController {
  constructor(private readonly programasService: ProgramasService) {}

 /* @Post()
  create(@Param('login') login: string,@Body() createProgramaDto: CreateProgramaDto) {
    return this.programasService.create(login, createProgramaDto);
  } */

  /*@Get('all')
  findAll() {
    return this.programasService.findAll();
  } */

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.programasService.findOne(id);
  }

 /* @Get()
  findpod(@Param('login') login:string){
    return this.programasService.findpod(login);
  } */

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProgramaDto: UpdateProgramaDto) {
    return this.programasService.update(id, updateProgramaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.programasService.remove(id);
  }
}
