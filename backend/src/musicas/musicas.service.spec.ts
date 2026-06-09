import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MusicasService } from './musicas.service';
import { Musica } from './musica.entity';
import { PlaybackService } from '../playback/playback.service';
import { ScoresService } from '../scores/score.service';

const mockRepository = {
  find:               jest.fn(),
  findOne:            jest.fn(),
  findOneByOrFail:    jest.fn(),
  save:               jest.fn(),
  increment:          jest.fn(),
  createQueryBuilder: jest.fn(),
};

const mockPlaybackService = {
  findByUser: jest.fn(),
  create:     jest.fn(),
};

const mockScoresService = {
  removerMusicaRecomendada: jest.fn(),
  calcularScores:           jest.fn(),
  getRecomendacoes:         jest.fn(),
};

describe('MusicasService', () => {
  let service: MusicasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MusicasService,
        {
          provide: getRepositoryToken(Musica),
          useValue: mockRepository,
        },
        {
          provide: PlaybackService,
          useValue: mockPlaybackService,
        },
        {
          provide: ScoresService,
          useValue: mockScoresService,
        },
      ],
    }).compile();

    service = module.get<MusicasService>(MusicasService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ─── emAlta ──────────────────────────────────────────────────────────────────

  describe('emAlta', () => {

    it('deve retornar as 10 músicas mais reproduzidas ordenadas por reproduções', async () => {
      const musicasMock = [
        { id: 1, titulo: 'Oceano', reproducoes: 1000, album: { generos: ['MPB'] } },
        { id: 2, titulo: 'Sina',   reproducoes: 999,  album: { generos: ['MPB'] } },
        { id: 3, titulo: 'Garota', reproducoes: 950,  album: { generos: ['Bossa Nova'] } },
      ];

      mockRepository.find.mockResolvedValue(musicasMock);

      const resultado = await service.emAlta();

      expect(resultado).toEqual(musicasMock);
      expect(mockRepository.find).toHaveBeenCalledWith({
        order:     { reproducoes: 'DESC', titulo: 'ASC' },
        take:      10,
        relations: ['artistas', 'album'],
      });
    });

    it('deve retornar lista vazia quando não há músicas', async () => {
      mockRepository.find.mockResolvedValue([]);

      const resultado = await service.emAlta();

      expect(resultado).toHaveLength(0);
      expect(resultado).toEqual([]);
    });

    it('deve retornar no máximo 10 músicas', async () => {
      const musicasMock = Array.from({ length: 10 }, (_, i) => ({
        id:          i + 1,
        titulo:      `Musica ${i + 1}`,
        reproducoes: 1000 - i,
        album:       { generos: ['MPB'] },
      }));

      mockRepository.find.mockResolvedValue(musicasMock);

      const resultado = await service.emAlta();

      expect(resultado).toHaveLength(10);
    });

  });

  // ─── buscar ───────────────────────────────────────────────────────────────────

  describe('buscar', () => {

    const criarQBMock = (resultados: any[]) => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere:          jest.fn().mockReturnThis(),
      orderBy:           jest.fn().mockReturnThis(),
      addOrderBy:        jest.fn().mockReturnThis(),
      addSelect:         jest.fn().mockReturnThis(),
      setParameter:      jest.fn().mockReturnThis(),
      limit:             jest.fn().mockReturnThis(),
      getMany:           jest.fn().mockResolvedValue(resultados),
    });

    it('deve chamar andWhere com ANY para gênero', async () => {
      const qbMock = criarQBMock([]);
      mockRepository.createQueryBuilder.mockReturnValue(qbMock);

      await service.buscar(undefined, undefined, 'MPB', undefined);

      expect(qbMock.andWhere).toHaveBeenCalledWith(
        ':genero = ANY(album.generos)',
        { genero: 'MPB' }
      );
    });

    it('deve chamar andWhere com os parâmetros corretos para termo', async () => {
      const qbMock = criarQBMock([]);
      mockRepository.createQueryBuilder.mockReturnValue(qbMock);

      await service.buscar('Oceano', undefined, undefined, undefined);

      expect(qbMock.andWhere).toHaveBeenCalledWith(
        'LOWER(musica.titulo) LIKE LOWER(:termo)',
        { termo: '%Oceano%' }
      );
    });

    it('deve chamar addSelect com o CASE WHEN correto quando há termo', async () => {
      const qbMock = criarQBMock([]);
      mockRepository.createQueryBuilder.mockReturnValue(qbMock);

      await service.buscar('Oceano', undefined, undefined, undefined);

      expect(qbMock.addSelect).toHaveBeenCalledWith(
        expect.stringContaining('CASE WHEN'),
        'relevancia'
      );
    });

    it('deve chamar orderBy por relevancia quando há termo', async () => {
      const qbMock = criarQBMock([]);
      mockRepository.createQueryBuilder.mockReturnValue(qbMock);

      await service.buscar('Oceano', undefined, undefined, undefined);

      expect(qbMock.orderBy).toHaveBeenCalledWith('relevancia', 'ASC');
      expect(qbMock.addOrderBy).toHaveBeenCalledWith('musica.reproducoes', 'DESC');
    });

    it('deve chamar orderBy por reproduções quando não há termo', async () => {
      const qbMock = criarQBMock([]);
      mockRepository.createQueryBuilder.mockReturnValue(qbMock);

      await service.buscar(undefined, undefined, 'MPB', undefined);

      expect(qbMock.orderBy).toHaveBeenCalledWith('musica.reproducoes', 'DESC');
      expect(qbMock.addSelect).not.toHaveBeenCalled();
    });

    it('deve chamar andWhere com os parâmetros corretos para artista', async () => {
      const qbMock = criarQBMock([]);
      mockRepository.createQueryBuilder.mockReturnValue(qbMock);

      await service.buscar(undefined, 'Noel Rosa', undefined, undefined);

      expect(qbMock.andWhere).toHaveBeenCalledWith(
        'LOWER(artista.nomeArtistico) LIKE LOWER(:artista)',
        { artista: '%Noel Rosa%' }
      );
    });

    it('deve chamar setParameter com o termo exato sem %', async () => {
      const qbMock = criarQBMock([]);
      mockRepository.createQueryBuilder.mockReturnValue(qbMock);

      await service.buscar('Oceano', undefined, undefined, undefined);

      expect(qbMock.setParameter).toHaveBeenCalledWith('termoExato', 'Oceano');
    });

    it('deve chamar andWhere com EXTRACT para ano', async () => {
      const qbMock = criarQBMock([]);
      mockRepository.createQueryBuilder.mockReturnValue(qbMock);

      await service.buscar(undefined, undefined, undefined, '1994');

      expect(qbMock.andWhere).toHaveBeenCalledWith(
        'EXTRACT(YEAR FROM CAST(album.data AS DATE)) = :ano',
        { ano: 1994 }
      );
    });

    it('não deve chamar andWhere quando nenhum filtro for informado', async () => {
      const qbMock = criarQBMock([]);
      mockRepository.createQueryBuilder.mockReturnValue(qbMock);

      await service.buscar(undefined, undefined, undefined, undefined);

      expect(qbMock.andWhere).not.toHaveBeenCalled();
    });

  });

  // ─── registrarReproducoes ─────────────────────────────────────────────────────

  describe('registrarReproducoes', () => {

    it('deve incrementar as reproduções e criar um playback', async () => {
      const musicaMock = { id: 1, titulo: 'Sina', reproducoes: 999 };

      mockRepository.findOneByOrFail.mockResolvedValue(musicaMock);
      mockRepository.increment.mockResolvedValue(undefined);
      mockPlaybackService.create.mockResolvedValue(undefined);
      mockPlaybackService.findByUser.mockResolvedValue([]);
      mockScoresService.removerMusicaRecomendada.mockResolvedValue(undefined);
      mockScoresService.calcularScores.mockResolvedValue(undefined);

      const resultado = await service.registrarReproducoes(1, 'LuisCardoso012');

      expect(mockRepository.increment).toHaveBeenCalledWith(
        { id: 1 }, 'reproducoes', 1
      );
      expect(mockPlaybackService.create).toHaveBeenCalledWith({
        login:    'LuisCardoso012',
        musicaid: 1,
      });
      expect(resultado).toEqual(musicaMock);
    });

    it('deve lançar erro quando a música não existe', async () => {
      mockRepository.findOneByOrFail.mockRejectedValue(
        new Error('Entity not found')
      );

      await expect(service.registrarReproducoes(999, 'LuisCardoso012'))
        .rejects
        .toThrow('Entity not found');

      expect(mockRepository.increment).not.toHaveBeenCalled();
      expect(mockPlaybackService.create).not.toHaveBeenCalled();
    });

    it('deve chamar findOneByOrFail com o id correto', async () => {
      const musicaMock = { id: 1, titulo: 'Oceano', reproducoes: 1000 };

      mockRepository.findOneByOrFail.mockResolvedValue(musicaMock);
      mockRepository.increment.mockResolvedValue(undefined);
      mockPlaybackService.create.mockResolvedValue(undefined);
      mockPlaybackService.findByUser.mockResolvedValue([]);
      mockScoresService.removerMusicaRecomendada.mockResolvedValue(undefined);
      mockScoresService.calcularScores.mockResolvedValue(undefined);

      await service.registrarReproducoes(1, 'LuisCardoso012');

      expect(mockRepository.findOneByOrFail).toHaveBeenCalledWith({ id: 1 });
    });

  });

});