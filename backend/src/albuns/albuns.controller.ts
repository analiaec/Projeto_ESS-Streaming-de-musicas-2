import { Controller, Post, Body, Put, Param, ParseIntPipe } from '@nestjs/common';
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

  // ROTA: PUT /albuns/:id (Usada para editar lançamentos existentes)
  @Put(':id')
  atualizar(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    // Pega o ID da URL (garantindo que é um número com ParseIntPipe) e repassa os dados pro Service
    return this.albunsService.atualizarMetadados(id, body);
  }
}
