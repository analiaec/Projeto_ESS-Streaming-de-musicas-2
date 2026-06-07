import { Controller, Post, Body, Put, Param, ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AlbunsService } from './albuns.service';

@Controller('albuns') 
export class AlbunsController {
  
  constructor(private readonly albunsService: AlbunsService) {}

  // ROTA: POST /albuns (Usada para criar lançamentos)
  @Post()
  criar(@Body() body: any) {
    // Pega o body da requisição e separa o array de 'musicas' do resto dos dados do álbum
    const { musicas, ...dadosAlbum } = body;
    
    // Manda os dados separados para o Service validar e salvar
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
    // Pega o ID da URL (garantindo que é um número com ParseIntPipe) e repassa os dados pro Service
    return this.albunsService.atualizarMetadados(id, body);
  }
}
