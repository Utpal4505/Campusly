import { Test, TestingModule } from '@nestjs/testing';
import { ClubsController } from './clubs.controller.js';
import { ClubsService } from './clubs.service.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';

describe('ClubsController', () => {
  let controller: ClubsController;
  let service: ClubsService;

  const mockClub = {
    id: 'club-1',
    name: 'Google Developer Student Club',
    description: 'Campus student developer community',
    creator: { id: 'user-1', name: 'Lead Organizer' },
    interests: [{ id: 'interest-1', name: 'Web Development' }],
    memberCount: 42,
    createdAt: new Date(),
  };

  const mockClubsService = {
    findAll: vi.fn().mockResolvedValue([mockClub]),
    findOne: vi.fn().mockResolvedValue(mockClub),
    join: vi.fn().mockResolvedValue({
      message: 'Successfully joined club',
      clubId: 'club-1',
      clubName: 'Google Developer Student Club',
      role: 'member',
      joinedAt: new Date(),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClubsController],
      providers: [
        {
          provide: ClubsService,
          useValue: mockClubsService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ClubsController>(ClubsController);
    service = module.get<ClubsService>(ClubsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getClubs', () => {
    it('should return an array of clubs', async () => {
      const result = await controller.getClubs();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockClub]);
    });
  });

  describe('getClub', () => {
    it('should return a single club by id', async () => {
      const result = await controller.getClub('club-1');
      expect(service.findOne).toHaveBeenCalledWith('club-1');
      expect(result).toEqual(mockClub);
    });
  });

  describe('joinClub', () => {
    it('should join the authenticated user to the club', async () => {
      const req = { user: { id: 'user-123' } } as any;
      const result = await controller.joinClub('club-1', req);
      expect(service.join).toHaveBeenCalledWith('club-1', 'user-123');
      expect(result.message).toBe('Successfully joined club');
      expect(result.clubId).toBe('club-1');
    });
  });
});
