import {
  Controller,
  Get,
  Param,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { TicketsService } from './tickets.service.js';
import { AuthService } from '../auth/auth.service.js';

@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly authService: AuthService,
  ) {}

  private async getUserIdFromRequest(req: Request): Promise<string> {
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value) {
        if (Array.isArray(value)) {
          for (const v of value) {
            headers.append(key, v);
          }
        } else {
          headers.set(key, value);
        }
      }
    }

    const session = await this.authService.getSession(headers);
    if (!session?.user?.id) {
      throw new UnauthorizedException('You must be logged in to access tickets');
    }
    return session.user.id;
  }

  /**
   * GET /tickets
   * Retrieve all event tickets for the authenticated student.
   */
  @Get()
  async getMyTickets(@Req() req: Request) {
    const userId = await this.getUserIdFromRequest(req);
    return this.ticketsService.findAllForUser(userId);
  }

  /**
   * GET /tickets/:id
   * Retrieve specific ticket details with owner-only access validation.
   */
  @Get(':id')
  async getTicketDetail(@Param('id') id: string, @Req() req: Request) {
    const userId = await this.getUserIdFromRequest(req);
    return this.ticketsService.findOneForUser(id, userId);
  }
}
