import { Test, TestingModule } from '@nestjs/testing';
import { InterestsController } from './interests.controller.js';
import { InterestsService } from './interests.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('InterestsController', () => {
  let controller: InterestsController;
  let service: InterestsService;

  const mockInterests = [
    { id: '1', name: 'Artificial Intelligence' },
    { id: '2', name: 'Web Development' },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InterestsController],
      providers: [
        InterestsService,
        {
          provide: PrismaService,
          useValue: {
            interest: {
              findMany: vi.fn().mockResolvedValue(mockInterests),
            },
          },
        },
      ],
    }).compile();

    controller = module.get<InterestsController>(InterestsController);
    service = module.get<InterestsService>(InterestsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getInterests', () => {
    it('should return an array of interests', async () => {
      const result = await controller.getInterests();
      expect(result).toEqual(mockInterests);
    });
  });
});
