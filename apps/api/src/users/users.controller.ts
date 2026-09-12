import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { updatePreferencesSchema } from '@repo/schemas';
import { UsersService } from './users.service.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * GET /users — public directory listing of campus students & peers
   */
  @Get()
  async getUsers(
    @Query('interest') interest?: string,
    @Query('search') search?: string,
  ) {
    return this.usersService.findAll(interest, search);
  }

  /**
   * GET /users/me — returns current authenticated user profile with their selected interests
   */
  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@Req() req: Request) {
    const user = (req as any).user;
    return this.usersService.getMe(user.id);
  }

  /**
   * GET /users/check-username — check if a campus handle is available in real-time
   */
  @Get('check-username')
  async checkUsername(@Query('username') username: string) {
    return this.usersService.checkUsername(username);
  }

  /**
   * GET /users/:id — public details of a specific student by ID or slug
   */
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * PATCH /users/me/preferences — updates student onboarding interest preferences
   */
  @Patch('me/preferences')
  @UseGuards(AuthGuard)
  async updatePreferences(
    @Req() req: Request,
    @Body() rawBody: unknown,
  ) {
    const user = (req as any).user;

    const parseResult = updatePreferencesSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      throw new BadRequestException(
        issue ? issue.message : 'Invalid preferences payload',
      );
    }

    return this.usersService.updatePreferences(
      user.id,
      parseResult.data.interestIds,
    );
  }

  /**
   * PATCH /users/me/username — update or claim student campus handle
   */
  @Patch('me/username')
  @UseGuards(AuthGuard)
  async updateUsername(
    @Req() req: Request,
    @Body('username') username: string,
  ) {
    const user = (req as any).user;
    if (!username || typeof username !== 'string') {
      throw new BadRequestException('Username is required');
    }
    return this.usersService.updateUsername(user.id, username);
  }

  /**
   * PATCH /users/me — update general student profile details
   */
  @Patch('me')
  @UseGuards(AuthGuard)
  async updateProfile(
    @Req() req: Request,
    @Body()
    body: {
      name?: string;
      bio?: string;
      department?: string;
      yearOfStudy?: number | string;
    },
  ) {
    const user = (req as any).user;
    return this.usersService.updateProfile(user.id, body);
  }
}
