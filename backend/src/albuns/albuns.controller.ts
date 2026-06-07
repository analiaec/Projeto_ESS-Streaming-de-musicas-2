import { Controller, Post, Body, Put, Param, ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AlbunsService } from './albuns.service';

@Controller('api/albuns')
export class AlbunsController {

  constructor(private readonly albunsService: AlbunsService) {}

  @Post()
  criar(@Body() body: any) {
    const { musicas, ...dadosAlbum } = body;
    return this.albunsService.criarLançamento(dadosAlbum, musicas);
  }

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/albuns',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExt = extname(file.originalname);
        cb(null, `${uniqueSuffix}${fileExt}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/image\/(jpeg|png|webp)/)) {
        cb(new BadRequestException('Apenas imagens são permitidas'), false as any);
      } else {
        cb(null, true as any);
      }
    },
  }))
  async uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Arquivo não enviado');
    const imageUrl = `/uploads/albuns/${file.filename}`;
    return this.albunsService.setImageUrl(id, imageUrl);
  }

  // ROTA: PUT /albuns/:id (Usada para editar lançamentos existentes)
  @Put(':id')
  atualizar(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.albunsService.atualizarMetadados(id, body);
  }

}