import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { EventsService } from './events.service.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  /**
   * GET /events — public listing of upcoming campus events
   */
  @Get()
  async getEvents() {
    return this.eventsService.findAll();
  }

  /**
   * GET /events/:id — public details of a specific event
   */
  @Get(':id')
  async getEvent(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  /**
   * POST /events/:id/register — protected registration endpoint
   */
  @Post(':id/register')
  @UseGuards(AuthGuard)
  async registerForEvent(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    const user = (req as any).user;
    return this.eventsService.register(id, user.id);
  }
}
