import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from './album.entity';
import { Musica } from '../musicas/musica.entity';

@Injectable()
export class AlbunsService {
  constructor(
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
  ) {}

  async findAll() {
    const ids = await this.albumRepository
      .createQueryBuilder('album')
      .select('album.id')
      .orderBy('album.id', 'DESC')
      .getMany();

    const result = await Promise.all(
      ids.map(({ id }) =>
        this.albumRepository.findOne({
          where: { id },
          relations: ['musicas', 'musicas.artistas'],
        }),
      ),
    );
    return result.filter(Boolean);
  }

  // criar um Álbum Completo ou um Single (album de 1 musica, pela regra do stakeholder)
  async criarLançamento(dadosAlbum: Partial<Album>, musicas: Partial<Musica>[]) {
    
    // REGRA DO STAKEHOLDER: Um álbum não pode ser criado vazio.
    // Se o array de músicas vier vazio, barramos a requisição.
    if (!musicas || musicas.length === 0) {
      throw new BadRequestException('Um álbum não pode existir sem músicas.');
    }

    // Cria a entidade do álbum em memória. 
    // Como a entidade Album tem cascade: true, o TypeORM vai salvar as músicas no banco automaticamente.
    const novoAlbum = this.albumRepository.create({
      ...dadosAlbum,
      musicas: musicas 
    });

    return this.albumRepository.save(novoAlbum);
  }


  //  editar metadados (possiveis) do Álbum existente
  async atualizarMetadados(id: number, dadosAtualizados: Partial<Album>) {
    
    // Verifica se o álbum realmente existe no banco antes de tentar editar
    const album = await this.albumRepository.findOneBy({ id });
    if (!album) {
      throw new NotFoundException('Álbum não encontrado.');
    }

    // REGRA DO STAKEHOLDER: Músicas não podem ser alteradas
    // Se o usuário tentar enviar alterações de músicas, apaga esse campo do pacote
    delete (dadosAtualizados as any).musicas;
    
    // Atualiza apenas os dados permitidos (nome, data, gêneros) no banco
    await this.albumRepository.update(id, dadosAtualizados);

    // devolve atualizado
    return this.albumRepository.findOneBy({ id });
  }

  async setImageUrl(id: number, imageUrl: string) {
    const album = await this.albumRepository.findOneBy({ id });
    if (!album) {
      throw new NotFoundException('Álbum não encontrado.');
    }
    await this.albumRepository.update(id, { imageUrl } as any);
    return this.albumRepository.findOneBy({ id });
  }
}
