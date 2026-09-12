import { Test, TestingModule } from '@nestjs/testing';
import { FeedService } from './feed.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('FeedService', () => {
  let service: FeedService;

  const mockEvents = [
    {
      id: 'event-ai',
      title: 'AI Summit',
      description: 'Annual AI conference',
      date: new Date('2026-11-01T10:00:00Z'),
      location: 'Auditorium A',
      createdAt: new Date('2026-09-01T10:00:00Z'),
      creator: { id: 'u1', name: 'AI Society' },
      interests: [
        { interest: { id: 'int-ai', name: 'Artificial Intelligence' } },
        { interest: { id: 'int-ds', name: 'Data Science' } },
      ],
      _count: { registrations: 20 },
    },
    {
      id: 'event-music',
      title: 'Campus Jam',
      description: 'Live band night',
      date: new Date('2026-11-05T18:00:00Z'),
      location: 'Student Center',
      createdAt: new Date('2026-09-02T10:00:00Z'),
      creator: { id: 'u2', name: 'Music Club' },
      interests: [{ interest: { id: 'int-music', name: 'Music' } }],
      _count: { registrations: 50 },
    },
  ];

  const mockClubs = [
    {
      id: 'club-dev',
      name: 'Web Dev Collective',
      description: 'Full-stack building group',
      createdAt: new Date('2026-09-03T10:00:00Z'),
      creator: { id: 'u3', name: 'Dev Lead' },
      interests: [
        { interest: { id: 'int-web', name: 'Web Development' } },
        { interest: { id: 'int-ai', name: 'Artificial Intelligence' } },
      ],
      _count: { members: 40 },
    },
    {
      id: 'club-cricket',
      name: 'Campus Cricket League',
      description: 'Cricket enthusiasts',
      createdAt: new Date('2026-09-04T10:00:00Z'),
      creator: { id: 'u4', name: 'Sports Head' },
      interests: [{ interest: { id: 'int-cricket', name: 'Cricket' } }],
      _count: { members: 25 },
    },
  ];

  const mockPrismaService = {
    userInterest: {
      findMany: vi.fn(),
    },
    event: {
      findMany: vi.fn(),
    },
    club: {
      findMany: vi.fn(),
    },
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<FeedService>(FeedService);
    mockPrismaService.event.findMany.mockResolvedValue(mockEvents);
    mockPrismaService.club.findMany.mockResolvedValue(mockClubs);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('unauthenticated feed', () => {
    it('should return unpersonalized feed with matchedInterests empty', async () => {
      const result = await service.getFeed();

      expect(mockPrismaService.userInterest.findMany).not.toHaveBeenCalled();
      expect(result.total).toBe(4);
      expect(result.hasPersonalizedResults).toBe(false);
      expect(result.items.every((i) => i.matchedInterests.length === 0)).toBe(true);
    });
  });

  describe('authenticated personalized feed', () => {
    it('should rank items with matching interests first and populate matchedInterests', async () => {
      // User is interested in AI and Web Development
      mockPrismaService.userInterest.findMany.mockResolvedValue([
        { interestId: 'int-ai' },
        { interestId: 'int-web' },
      ]);

      const result = await service.getFeed('user-1');

      expect(mockPrismaService.userInterest.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        select: { interestId: true },
      });

      expect(result.total).toBe(4);
      expect(result.hasPersonalizedResults).toBe(true);

      // Both club-dev (has int-web and int-ai => 2 matches => score 20)
      // and event-ai (has int-ai => 1 match => score 10)
      // should rank higher than music and cricket (0 matches => score 0)
      expect(result.items[0]?.id).toBe('club-dev');
      expect(result.items[0]?.matchedInterests).toEqual(
        expect.arrayContaining(['Web Development', 'Artificial Intelligence']),
      );

      expect(result.items[1]?.id).toBe('event-ai');
      expect(result.items[1]?.matchedInterests).toEqual(['Artificial Intelligence']);

      // Unmatched items have matchedInterests empty
      expect(result.items[2]?.matchedInterests).toEqual([]);
      expect(result.items[3]?.matchedInterests).toEqual([]);
    });

    it('should handle users with interests that match nothing cleanly', async () => {
      // User interested in Robotics, which none of our mock items tag
      mockPrismaService.userInterest.findMany.mockResolvedValue([
        { interestId: 'int-robotics' },
      ]);

      const result = await service.getFeed('user-2');

      expect(result.total).toBe(4);
      expect(result.hasPersonalizedResults).toBe(false);
      expect(result.items.every((i) => i.matchedInterests.length === 0)).toBe(true);
    });
  });
});
