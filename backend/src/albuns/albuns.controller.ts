import { Controller, Post, Body, Put, Param, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AlbunsService }   from './albuns.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage }     from 'multer';
import { extname }         from 'path';

@Controller('api/albuns')
export class AlbunsController {

  constructor(private readonly albunsService: AlbunsService) {}

  @Post()
  criar(@Body() body: any) {
    const { musicas, ...dadosAlbum } = body;
    return this.albunsService.criarLançamento(dadosAlbum, musicas);
  }

  @Put(':id')
  atualizar(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.albunsService.atualizarMetadados(id, body);
  }

}