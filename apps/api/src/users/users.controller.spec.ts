import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser = {
    id: 'user-1',
    name: 'Utpal',
    email: 'utpal@campus.edu',
    bio: 'CS Student',
    department: 'CSE',
    yearOfStudy: 2,
    createdAt: new Date(),
    interests: [{ id: 'interest-1', name: 'Artificial Intelligence' }],
  };

  const mockUsersService = {
    getMe: vi.fn().mockResolvedValue(mockUser),
    updatePreferences: vi.fn().mockResolvedValue({
      message: 'Preferences updated successfully',
      interests: [{ id: 'interest-1', name: 'Artificial Intelligence' }],
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMe', () => {
    it('should return user profile with interests', async () => {
      const req = { user: { id: 'user-1' } } as any;
      const result = await controller.getMe(req);
      expect(service.getMe).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(mockUser);
    });
  });

  describe('updatePreferences', () => {
    it('should update preferences with valid interestIds', async () => {
      const req = { user: { id: 'user-1' } } as any;
      const body = { interestIds: ['interest-1'] };
      const result = await controller.updatePreferences(req, body);
      expect(service.updatePreferences).toHaveBeenCalledWith('user-1', [
        'interest-1',
      ]);
      expect(result).toEqual({
        message: 'Preferences updated successfully',
        interests: [{ id: 'interest-1', name: 'Artificial Intelligence' }],
      });
    });

    it('should throw BadRequestException when interestIds is empty', async () => {
      const req = { user: { id: 'user-1' } } as any;
      const body = { interestIds: [] };
      await expect(controller.updatePreferences(req, body)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when body is invalid', async () => {
      const req = { user: { id: 'user-1' } } as any;
      const body = { invalidField: 123 };
      await expect(controller.updatePreferences(req, body)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
