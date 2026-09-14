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

  /**
   * POST /clubs/:id/apply — submit student audition / recruitment application
   */
  @Post(':id/apply')
  async applyForAudition(
    @Param('id') id: string,
    @Body() body: any,
    @Req() req: Request,
  ) {
    const user = (req as any).user;
    const userId = user?.id || `student-${body.regNo || Date.now()}`;
    return this.clubsService.applyForAudition(id, body, userId);
  }

  /**
   * GET /clubs/:id/applications — get club audition pipeline applications
   */
  @Get(':id/applications')
  async getApplications(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    const status = req.query['status'] as string | undefined;
    return this.clubsService.getAuditionApplications(id, status);
  }

  /**
   * PATCH /clubs/:id/applications/:appId — update applicant status / schedule interview
   */
  @Post(':id/applications/:appId')
  async updateApplicationStatus(
    @Param('id') id: string,
    @Param('appId') appId: string,
    @Body() body: any,
  ) {
    return this.clubsService.updateApplicationStatus(id, appId, body);
  }

  /**
   * GET /clubs/:id/members — get club member roster
   */
  @Get(':id/members')
  async getMembers(@Param('id') id: string) {
    return this.clubsService.getClubMembers(id);
  }

  /**
   * Post /clubs/:id/members/:userId/role — update a member's role
   */
  @Post(':id/members/:userId/role')
  async updateMemberRole(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() body: { role: string },
  ) {
    return this.clubsService.updateMemberRole(id, userId, body.role);
  }

  /**
   * GET /clubs/:id/settings — get club settings & status
   */
  @Get(':id/settings')
  async getSettings(@Param('id') id: string) {
    return this.clubsService.getClubSettings(id);
  }

  /**
   * POST /clubs/:id/settings — update club settings
   */
  @Post(':id/settings')
  async updateSettings(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.clubsService.updateClubSettings(id, body);
  }
}
