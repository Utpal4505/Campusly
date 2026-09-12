import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { ClubsService } from './clubs.service.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';

@Controller('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  /**
   * GET /clubs — public listing of all campus clubs
   */
  @Get()
  async getClubs() {
    return this.clubsService.findAll();
  }

  /**
   * POST /clubs — create a new campus club
   */
  @Post()
  async createClub(
    @Body() body: any,
    @Req() req: Request,
  ) {
    const user = (req as any).user;
    const creatorId = user?.id || 'seed-organizer-user';
    return this.clubsService.create(body, creatorId);
  }

  /**
   * GET /clubs/:id — public details of a specific club
   */
  @Get(':id')
  async getClub(@Param('id') id: string) {
    return this.clubsService.findOne(id);
  }

  /**
   * POST /clubs/:id/join — protected endpoint to join a club
   */
  @Post(':id/join')
  @UseGuards(AuthGuard)
  async joinClub(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    const user = (req as any).user;
    return this.clubsService.join(id, user.id);
  }
}
