import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { MessagesService } from './messages.service.js';
import { MessagesGateway } from './messages.gateway.js';
import { AuthService } from '../auth/auth.service.js';

@Controller('conversations')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly messagesGateway: MessagesGateway,
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
      throw new UnauthorizedException('You must be logged in to access messages');
    }
    return session.user.id;
  }

  /**
   * GET /conversations
   * Retrieve all conversations for the authenticated student.
   */
  @Get()
  async getConversations(@Req() req: Request) {
    const userId = await this.getUserIdFromRequest(req);
    return this.messagesService.getUserConversations(userId);
  }

  /**
   * POST /conversations
   * Get or start a conversation with a peer student.
   */
  @Post()
  async createConversation(
    @Body('recipientId') recipientId: string,
    @Req() req: Request,
  ) {
    const userId = await this.getUserIdFromRequest(req);
    return this.messagesService.getOrCreateConversation(userId, recipientId);
  }

  /**
   * GET /conversations/:id/messages
   * Retrieve message history for a conversation.
   */
  @Get(':id/messages')
  async getMessages(@Param('id') id: string, @Req() req: Request) {
    const userId = await this.getUserIdFromRequest(req);
    return this.messagesService.getMessages(id, userId);
  }

  /**
   * POST /conversations/:id/messages
   * Send a message in a conversation.
   */
  @Post(':id/messages')
  async sendMessage(
    @Param('id') id: string,
    @Body('content') content: string,
    @Req() req: Request,
  ) {
    const userId = await this.getUserIdFromRequest(req);
    const message = await this.messagesService.createMessage(id, userId, content);

    // Broadcast to WebSocket room
    this.messagesGateway.broadcastMessage(id, message);

    return message;
  }
}
