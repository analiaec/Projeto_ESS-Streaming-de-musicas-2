import { Test, TestingModule } from '@nestjs/testing';
import { PodcastController } from './podcast.controller';
import { PodcastService } from './podcast.service';

describe('PodcastController', () => {
  let controller: PodcastController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PodcastController],
      providers: [
        {
          // mock simples pra testar so o controller
          provide: PodcastService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<PodcastController>(PodcastController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
