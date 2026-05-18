import { Controller, Get, Post, Query, Param, ParseIntPipe} from '@nestjs/common';
import { MusicasService } from './musicas.service';
import { BuscarMusicaDto } from './dto/buscar-musicas.dto';

@Controller('users/:login/musicas')
export class MusicasController {

  constructor(private readonly musicasService: MusicasService) {}

  @Get('em-alta')
  emAlta() {
    return this.musicasService.emAlta();
  }
  @Get()
  buscar(@Query() dto: BuscarMusicaDto) {
    return this.musicasService.buscar(
      dto.termo,
      dto.artista,
      dto.genero,
      dto.ano
    );
  }
  @Post(':id/reproducao') 
    registrarReproducoes(@Param('id', ParseIntPipe) id: number, @Param('login') login: string) {
        return this.musicasService.registrarReproducoes(id, login);
    }

  }
