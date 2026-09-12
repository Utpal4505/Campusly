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
}
