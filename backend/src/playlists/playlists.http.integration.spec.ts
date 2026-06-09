/// <reference types="jest" />

import { ConflictException, INestApplication, NotFoundException, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { PlaylistsController } from './playlists.controller';
import { PlaylistsService } from './playlists.service';

describe('Playlists HTTP integration', () => {
  let app: INestApplication;

  const serviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [PlaylistsController],
      providers: [
        {
          provide: PlaylistsService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false }));
    app.setGlobalPrefix('api');
    await app.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('deve criar playlist via POST /api/playlists', async () => {
    serviceMock.create.mockResolvedValue({
      id: 1,
      nome: 'Playlist para integração',
      descricao: 'Será criada no teste',
      publica: true,
      ownerLogin: 'LuisCardoso012',
      seguidores: [],
    });

    const resposta = await request(app.getHttpServer())
      .post('/api/playlists')
      .send({
        nome: 'Playlist para integração',
        descricao: 'Será criada no teste',
        publica: true,
        ownerLogin: 'LuisCardoso012',
      })
      .expect(201);

    expect(serviceMock.create).toHaveBeenCalledWith({
      nome: 'Playlist para integração',
      descricao: 'Será criada no teste',
      publica: true,
      ownerLogin: 'LuisCardoso012',
    });
    expect(resposta.body).toMatchObject({ id: 1, nome: 'Playlist para integração' });
  });

  it('deve retornar 409 ao criar playlist com nome duplicado', async () => {
    serviceMock.create.mockRejectedValue(new ConflictException('Essa playlist já existe, escolha um novo nome.'));

    const resposta = await request(app.getHttpServer())
      .post('/api/playlists')
      .send({
        nome: 'Playlist duplicada',
        descricao: 'Primeira versão',
        publica: true,
        ownerLogin: 'LuisCardoso012',
      })
      .expect(409);

    expect(serviceMock.create).toHaveBeenCalled();
    expect(resposta.body.message).toBe('Essa playlist já existe, escolha um novo nome.');
  });

  it('deve atualizar playlist via PATCH /api/playlists/:id', async () => {
    serviceMock.update.mockResolvedValue({
      id: 1,
      nome: 'Playlist atualizada',
      descricao: 'Depois da atualização',
      publica: true,
      ownerLogin: 'LuisCardoso012',
      seguidores: [],
    });

    const resposta = await request(app.getHttpServer())
      .patch('/api/playlists/1')
      .send({
        nome: 'Playlist atualizada',
        descricao: 'Depois da atualização',
      })
      .expect(200);

    expect(serviceMock.update).toHaveBeenCalledWith(1, {
      nome: 'Playlist atualizada',
      descricao: 'Depois da atualização',
    });
    expect(resposta.body).toMatchObject({ id: 1, nome: 'Playlist atualizada' });
  });

  it('deve remover playlist via DELETE /api/playlists/:id', async () => {
    serviceMock.remove.mockResolvedValue({
      id: 2,
      nome: 'Playlist para delete',
      descricao: 'Será removida',
      publica: true,
      ownerLogin: 'LuisCardoso012',
      seguidores: [],
    });

    const respostaDelete = await request(app.getHttpServer())
      .delete('/api/playlists/2')
      .expect(200);

    expect(serviceMock.remove).toHaveBeenCalledWith(2);
    expect(respostaDelete.body).toHaveProperty('id', 2);
  });

  it('deve retornar 404 quando a playlist não existir', async () => {
    serviceMock.findOne.mockRejectedValue(new NotFoundException('Playlist not found'));

    const resposta = await request(app.getHttpServer())
      .get('/api/playlists/999')
      .expect(404);

    expect(serviceMock.findOne).toHaveBeenCalledWith(999);
    expect(resposta.body.message).toBe('Playlist not found');
  });
});
