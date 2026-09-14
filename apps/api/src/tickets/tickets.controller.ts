import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
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
   * POST /tickets/checkin
   * Scan and verify an event ticket at the gate.
   */
  @Post('checkin')
  async checkinTicket(@Body() body: { ticketNumberOrId: string; eventId?: string }) {
    if (!body?.ticketNumberOrId) {
      throw new BadRequestException('Ticket number or QR code is required');
    }
    return this.ticketsService.checkinTicket(body.ticketNumberOrId, body.eventId);
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

  /**
   * GET /tickets/event/:eventId/attendance
   * Get live gate attendance statistics and attendee roster for duty leave export.
   */
  @Get('event/:eventId/attendance')
  async getEventAttendance(@Param('eventId') eventId: string) {
    return this.ticketsService.getEventAttendance(eventId);
  }

  /**
   * POST /tickets/event/:eventId/manual-checkin
   * Manually check in an attendee by ticket number, email, or registration number.
   */
  @Post('event/:eventId/manual-checkin')
  async manualCheckin(
    @Param('eventId') eventId: string,
    @Body() body: { query: string },
  ) {
    if (!body?.query) {
      throw new BadRequestException('Attendee identifier (ticket number, reg no, or email) is required');
    }
    return this.ticketsService.manualCheckin(eventId, body.query);
  }
}
