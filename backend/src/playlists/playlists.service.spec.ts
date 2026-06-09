import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Playlist } from './playlist.entity';
import { Musica } from '../musicas/musica.entity';
import { PlaylistsService } from './playlists.service';

const queryBuilderMock = () => ({
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  getOne: jest.fn(),
});

const playlistRepositoryMock = {
  createQueryBuilder: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  remove: jest.fn(),
};

const musicaRepositoryMock = {
  findOne: jest.fn(),
};

describe('PlaylistsService', () => {
  let service: PlaylistsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlaylistsService,
        {
          provide: getRepositoryToken(Playlist),
          useValue: playlistRepositoryMock,
        },
        {
          provide: getRepositoryToken(Musica),
          useValue: musicaRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<PlaylistsService>(PlaylistsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar uma playlist', async () => {
      const dto = {
        nome: 'Playlist para teste',
        descricao: 'Melhores musicas',
        publica: true,
        ownerLogin: 'LuisCardoso012',
      };

      const qbMock = queryBuilderMock();
      qbMock.getOne.mockResolvedValue(null);
      playlistRepositoryMock.createQueryBuilder.mockReturnValue(qbMock);
      playlistRepositoryMock.create.mockReturnValue({ ...dto, seguidores: [] });
      playlistRepositoryMock.save.mockResolvedValue({ id: 1, ...dto, seguidores: [] });

      const resultado = await service.create(dto);

      expect(playlistRepositoryMock.createQueryBuilder).toHaveBeenCalledWith('pl');
      expect(playlistRepositoryMock.create).toHaveBeenCalledWith({
        ...dto,
        seguidores: [],
      });
      expect(playlistRepositoryMock.save).toHaveBeenCalled();
      expect(resultado).toMatchObject({ id: 1, nome: dto.nome });
    });

    it('deve lançar conflito quando a playlist já existir para o mesmo usuário', async () => {
      const dto = {
        nome: 'Playlist duplicada',
        descricao: 'Melhores musicas',
        publica: true,
        ownerLogin: 'LuisCardoso012',
      };

      const qbMock = queryBuilderMock();
      qbMock.getOne.mockResolvedValue({ id: 10, nome: dto.nome });
      playlistRepositoryMock.createQueryBuilder.mockReturnValue(qbMock);

      await expect(service.create(dto)).rejects.toBeInstanceOf(ConflictException);
      expect(playlistRepositoryMock.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('deve retornar todas as playlists com relações', async () => {
      const playlists = [{ id: 1, nome: 'Favoritas' }];
      playlistRepositoryMock.find.mockResolvedValue(playlists);

      const resultado = await service.findAll();

      expect(playlistRepositoryMock.find).toHaveBeenCalledWith({
        relations: ['musicas', 'musicas.album', 'musicas.artistas'],
      });
      expect(resultado).toEqual(playlists);
    });
  });

  describe('findOne', () => {
    it('deve buscar playlist por id', async () => {
      const playlist = { id: 7, nome: 'Rock Brasil' };
      playlistRepositoryMock.findOne.mockResolvedValue(playlist);

      const resultado = await service.findOne(7);

      expect(playlistRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: 7 },
        relations: ['musicas', 'musicas.album', 'musicas.artistas'],
      });
      expect(resultado).toEqual(playlist);
    });

    it('deve lançar erro quando a playlist não existir', async () => {
      playlistRepositoryMock.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar o nome da playlist', async () => {
      const playlist = {
        id: 1,
        nome: 'Playlist antiga',
        descricao: 'Descrição antiga',
        publica: true,
        ownerLogin: 'LuisCardoso012',
      };

      const qbMock = queryBuilderMock();
      qbMock.getOne.mockResolvedValue(null);
      playlistRepositoryMock.createQueryBuilder.mockReturnValue(qbMock);
      playlistRepositoryMock.findOne.mockResolvedValue(playlist);
      playlistRepositoryMock.save.mockResolvedValue({ ...playlist, nome: 'Playlist nova' });

      const resultado = await service.update(1, { nome: 'Playlist nova' });

      expect(playlistRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['musicas', 'musicas.album', 'musicas.artistas'],
      });
      expect(playlistRepositoryMock.save).toHaveBeenCalledWith({
        ...playlist,
        nome: 'Playlist nova',
      });
      expect(resultado).toMatchObject({ nome: 'Playlist nova' });
    });

    it('deve lançar conflito ao renomear para uma playlist já existente do mesmo usuário', async () => {
      const playlist = {
        id: 1,
        nome: 'Playlist antiga',
        descricao: 'Descrição antiga',
        publica: true,
        ownerLogin: 'LuisCardoso012',
      };

      const qbMock = queryBuilderMock();
      qbMock.getOne.mockResolvedValue({ id: 2, nome: 'Playlist nova' });
      playlistRepositoryMock.createQueryBuilder.mockReturnValue(qbMock);
      playlistRepositoryMock.findOne.mockResolvedValue(playlist);

      await expect(service.update(1, { nome: 'Playlist nova' })).rejects.toBeInstanceOf(ConflictException);
      expect(playlistRepositoryMock.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deve remover uma playlist', async () => {
      const playlist = { id: 1, nome: 'Playlist para delete' };
      playlistRepositoryMock.findOne.mockResolvedValue(playlist);
      playlistRepositoryMock.remove.mockResolvedValue(playlist);

      const resultado = await service.remove(1);

      expect(playlistRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['musicas', 'musicas.album', 'musicas.artistas'],
      });
      expect(playlistRepositoryMock.remove).toHaveBeenCalledWith(playlist);
      expect(resultado).toEqual(playlist);
    });
  });
});
