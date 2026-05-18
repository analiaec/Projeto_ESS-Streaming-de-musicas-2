import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PodcastService } from './podcast.service';
import { Podcast } from './entities/podcast.entity';
import { Episode } from '../episodes/entities/episode.entity';
import { User } from '../users/entities/user.entity';
import { Artista } from '../artistas/artista.entity';

describe('PodcastService', () => {
  let service: PodcastService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PodcastService,
        // mocks dos repos pra injetar service sem banco real
        { provide: getRepositoryToken(Podcast), useValue: {} },
        { provide: getRepositoryToken(Episode), useValue: {} },
        { provide: getRepositoryToken(User), useValue: {} },
        { provide: getRepositoryToken(Artista), useValue: {} },
      ],
    }).compile();

    service = module.get<PodcastService>(PodcastService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
