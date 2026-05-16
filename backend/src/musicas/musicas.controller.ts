import { Controller, Get, Post, Query, Param, ParseIntPipe } from '@nestjs/common';
import { MusicasService } from './musicas.service';

@Controller('musicas')
export class MusicasController {

  constructor(private readonly musicasService: MusicasService) {}

  @Get('em-alta')
  emAlta() {
    return this.musicasService.emAlta();
  }
  @Get()
    buscar(@Query('termo') termo?: string, 
    @Query('artista') artista?: string,
    @Query('genero') genero?: string,
    @Query('ano') ano?: string) {
        return this.musicasService.buscar(termo, artista, genero, ano);
    }
  @Post(':id/reproducao') 
    registrarReproducoes(@Param('id', ParseIntPipe) id: number) {
        return this.musicasService.registrarReproducoes(id);
    }

  }
