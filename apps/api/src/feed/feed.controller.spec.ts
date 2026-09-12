import { Test, TestingModule } from '@nestjs/testing';
import { FeedController } from './feed.controller.js';
import { FeedService } from './feed.service.js';
import { AuthService } from '../auth/auth.service.js';
import type { FeedResponse } from '@repo/schemas';

describe('FeedController', () => {
  let controller: FeedController;
  let feedService: FeedService;
  let authService: AuthService;

  const mockColdStartFeed: FeedResponse = {
    items: [
      {
        type: 'event',
        id: 'event-1',
        title: 'HackCampus 2026',
        description: 'Campus hackathon',
        matchedInterests: [],
        interests: [{ id: 'int-1', name: 'Artificial Intelligence' }],
        metadata: {
          date: '2026-10-15T09:00:00.000Z',
          location: 'Main Hall',
          registrationCount: 15,
          creatorName: 'Tech Club',
        },
      },
      {
        type: 'club',
        id: 'club-1',
        title: 'GDG On Campus',
        description: 'Developer student community',
        matchedInterests: [],
        interests: [{ id: 'int-2', name: 'Web Development' }],
        metadata: {
          memberCount: 30,
          creatorName: 'Lead Dev',
        },
      },
    ],
    total: 2,
    hasPersonalizedResults: false,
  };

  const mockPersonalizedFeed: FeedResponse = {
    items: [
      {
        type: 'event',
        id: 'event-1',
        title: 'HackCampus 2026',
        description: 'Campus hackathon',
        matchedInterests: ['Artificial Intelligence'],
        interests: [{ id: 'int-1', name: 'Artificial Intelligence' }],
        metadata: {
          date: '2026-10-15T09:00:00.000Z',
          location: 'Main Hall',
          registrationCount: 15,
          creatorName: 'Tech Club',
        },
      },
      {
        type: 'club',
        id: 'club-1',
        title: 'GDG On Campus',
        description: 'Developer student community',
        matchedInterests: [],
        interests: [{ id: 'int-2', name: 'Web Development' }],
        metadata: {
          memberCount: 30,
          creatorName: 'Lead Dev',
        },
      },
    ],
    total: 2,
    hasPersonalizedResults: true,
  };

  const mockFeedService = {
    getFeed: vi.fn(),
  };

  const mockAuthService = {
    getSession: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedController],
      providers: [
        {
          provide: FeedService,
          useValue: mockFeedService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<FeedController>(FeedController);
    feedService = module.get<FeedService>(FeedService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getFeed without authentication', () => {
    it('should return discovery feed without user id if no session exists', async () => {
      mockAuthService.getSession.mockResolvedValue(null);
      mockFeedService.getFeed.mockResolvedValue(mockColdStartFeed);

      const req = { headers: {} } as any;
      const result = await controller.getFeed(req);

      expect(authService.getSession).toHaveBeenCalled();
      expect(feedService.getFeed).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(mockColdStartFeed);
      expect(result.hasPersonalizedResults).toBe(false);
    });
  });

  describe('getFeed with authenticated session', () => {
    it('should return personalized feed using session user id', async () => {
      mockAuthService.getSession.mockResolvedValue({
        user: { id: 'user-123', email: 'alex@campus.edu' },
      });
      mockFeedService.getFeed.mockResolvedValue(mockPersonalizedFeed);

      const req = {
        headers: {
          authorization: 'Bearer token-123',
        },
      } as any;
      const result = await controller.getFeed(req);

      expect(authService.getSession).toHaveBeenCalled();
      expect(feedService.getFeed).toHaveBeenCalledWith('user-123');
      expect(result).toEqual(mockPersonalizedFeed);
      expect(result.hasPersonalizedResults).toBe(true);
      expect(result.items[0]?.matchedInterests).toContain('Artificial Intelligence');
    });

    it('should handle getSession failure gracefully and fall back to anonymous feed', async () => {
      mockAuthService.getSession.mockRejectedValue(new Error('Session fetch error'));
      mockFeedService.getFeed.mockResolvedValue(mockColdStartFeed);

      const req = { headers: { cookie: 'corrupted-session' } } as any;
      const result = await controller.getFeed(req);

      expect(feedService.getFeed).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(mockColdStartFeed);
    });
  });
});
