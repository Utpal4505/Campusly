import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { updatePreferencesSchema } from '@repo/schemas';
import { UsersService } from './users.service.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * GET /users/me — returns current authenticated user profile with their selected interests
   */
  @Get('me')
  async getMe(@Req() req: Request) {
    const user = (req as any).user;
    return this.usersService.getMe(user.id);
  }

  /**
   * PATCH /users/me/preferences — updates student onboarding interest preferences
   */
  @Patch('me/preferences')
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
