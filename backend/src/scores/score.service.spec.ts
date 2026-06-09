import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ScoresService } from './score.service';
import { Score } from './score.entity';
import { Musica } from '../musicas/musica.entity';
import { PlaybackService } from '../playback/playback.service';

const mockScoreRepository = {
  find: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

const mockQueryBuilder = {
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  orWhere: jest.fn().mockReturnThis(),
  getMany: jest.fn(),
};

const mockMusicaRepository = {
  createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
};

const mockPlaybackService = {
  findByUser: jest.fn(),
};

describe('ScoresService', () => {
  let service: ScoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScoresService,
        {
          provide: getRepositoryToken(Score),
          useValue: mockScoreRepository,
        },
        {
          provide: getRepositoryToken(Musica),
          useValue: mockMusicaRepository,
        },
        {
          provide: PlaybackService,
          useValue: mockPlaybackService,
        },
      ],
    }).compile();

    service = module.get<ScoresService>(ScoresService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('calcularScores', () => {
    it('deve remover scores quando o usuário não possuir histórico', async () => {
      mockPlaybackService.findByUser.mockRejectedValue(
        new Error('Playback nao encontrado'),
      );

      await service.calcularScores('theo');

      expect(mockScoreRepository.delete).toHaveBeenCalledWith({
        user: { login: 'theo' },
      });

      expect(mockScoreRepository.save).not.toHaveBeenCalled();
    });

    it('deve calcular e salvar scores quando houver histórico', async () => {
      const historico = [
        {
          musica: {
            id: 1,
            album: {
              generos: ['Rock'],
            },
            artistas: [
              {
                nomeArtistico: 'Queen',
              },
            ],
          },
        },
      ];

      const musicasDisponiveis = [
        {
          id: 2,
          album: {
            generos: ['Rock'],
          },
          artistas: [
            {
              nomeArtistico: 'Queen',
            },
          ],
        },
      ];

      mockPlaybackService.findByUser.mockResolvedValue(historico);

      mockQueryBuilder.getMany.mockResolvedValue(
        musicasDisponiveis,
      );

      await service.calcularScores('theo');

      expect(
        mockMusicaRepository.createQueryBuilder,
      ).toHaveBeenCalledWith('musica');

      expect(mockScoreRepository.delete).toHaveBeenCalled();

      expect(mockScoreRepository.save).toHaveBeenCalled();

      const savedScores =
        mockScoreRepository.save.mock.calls[0][0];

      expect(savedScores).toHaveLength(1);

      expect(savedScores[0]).toEqual(
        expect.objectContaining({
          user: { login: 'theo' },
          musica: musicasDisponiveis[0],
          score: expect.any(Number),
        }),
      );
    });

    it('não deve falhar quando não houver músicas recomendáveis', async () => {
      const historico = [
        {
          musica: {
            id: 1,
            album: {
              generos: ['Rock'],
            },
            artistas: [
              {
                nomeArtistico: 'Queen',
              },
            ],
          },
        },
      ];

      mockPlaybackService.findByUser.mockResolvedValue(
        historico,
      );

      mockQueryBuilder.getMany.mockResolvedValue([]);

      await service.calcularScores('theo');

      expect(mockScoreRepository.delete).toHaveBeenCalled();

      expect(mockScoreRepository.save).toHaveBeenCalledWith([]);
    });
  });

  describe('getRecomendacoes', () => {
    it('deve retornar recomendações do usuário', async () => {
      const recomendacoes = [
        { score: 0.9 },
        { score: 0.8 },
      ];

      mockScoreRepository.find.mockResolvedValue(
        recomendacoes,
      );

      const result =
        await service.getRecomendacoes('theo');

      expect(mockScoreRepository.find).toHaveBeenCalledWith({
        where: {
          user: { login: 'theo' },
          score: expect.anything(),
        },
        relations: [
          'musica',
          'musica.artistas',
          'musica.album',
        ],
        order: { score: 'DESC' },
        take: 10,
      });

      expect(result).toEqual(recomendacoes);
    });
  });

  describe('removerMusicaRecomendada', () => {
    it('deve remover uma música recomendada do usuário', async () => {
      await service.removerMusicaRecomendada(
        'theo',
        5,
      );

      expect(mockScoreRepository.delete).toHaveBeenCalledWith({
        user: { login: 'theo' },
        musica: { id: 5 },
      });
    });
  });
});