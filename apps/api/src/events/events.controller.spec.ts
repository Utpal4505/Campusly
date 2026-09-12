import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller.js';
import { EventsService } from './events.service.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';

describe('EventsController', () => {
  let controller: EventsController;
  let service: EventsService;

  const mockEvent = {
    id: 'event-1',
    title: 'HackCampus 2026',
    description: '36-hour annual hackathon',
    date: new Date('2026-10-15T09:00:00Z'),
    location: 'Uni Auditorium',
    creator: { id: 'user-1', name: 'Tech Club' },
    interests: [{ id: 'interest-1', name: 'Artificial Intelligence' }],
    registrationCount: 12,
    createdAt: new Date(),
  };

  const mockEventsService = {
    findAll: vi.fn().mockResolvedValue([mockEvent]),
    findOne: vi.fn().mockResolvedValue(mockEvent),
    register: vi.fn().mockResolvedValue({
      message: 'Successfully registered for event',
      eventId: 'event-1',
      eventTitle: 'HackCampus 2026',
      registeredAt: new Date(),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: EventsService,
          useValue: mockEventsService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<EventsController>(EventsController);
    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getEvents', () => {
    it('should return an array of events', async () => {
      const result = await controller.getEvents();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockEvent]);
    });
  });

  describe('getEvent', () => {
    it('should return a single event by id', async () => {
      const result = await controller.getEvent('event-1');
      expect(service.findOne).toHaveBeenCalledWith('event-1');
      expect(result).toEqual(mockEvent);
    });
  });

  describe('registerForEvent', () => {
    it('should register the authenticated user for the event', async () => {
      const req = { user: { id: 'user-123' } } as any;
      const result = await controller.registerForEvent('event-1', req);
      expect(service.register).toHaveBeenCalledWith('event-1', 'user-123');
      expect(result.message).toBe('Successfully registered for event');
      expect(result.eventId).toBe('event-1');
    });
  });
});
