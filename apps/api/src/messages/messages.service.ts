import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * List all conversations for the current student.
   */
  async getUserConversations(userId: string) {
    const participants = await this.prisma.conversationParticipant.findMany({
      where: { userId },
      include: {
        conversation: {
          include: {
            participants: {
              include: {
                user: true,
              },
            },
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
      orderBy: {
        conversation: {
          updatedAt: 'desc',
        },
      },
    });

    return participants.map((part) => {
      const conv = part.conversation;
      const peerPart = conv.participants.find((p) => p.userId !== userId);
      const peer = peerPart?.user || conv.participants[0]?.user;
      const lastMsg = conv.messages[0] || null;

      return {
        id: conv.id,
        createdAt: conv.createdAt.toISOString(),
        updatedAt: conv.updatedAt.toISOString(),
        peer: {
          id: peer ? peer.id : 'unknown',
          name: peer ? peer.name : 'Campus Peer',
          email: peer ? peer.email : '',
          image: peer ? peer.image : null,
          department: peer ? peer.department : 'Engineering',
          yearOfStudy: peer ? peer.yearOfStudy : 3,
        },
        lastMessage: lastMsg
          ? {
              id: lastMsg.id,
              content: lastMsg.content,
              createdAt: lastMsg.createdAt.toISOString(),
              senderId: lastMsg.senderId,
            }
          : null,
        unreadCount: 0,
      };
    });
  }

  /**
   * Find existing or create a new 1-on-1 conversation between two campus students.
   */
  async getOrCreateConversation(userId: string, recipientIdOrEmail: string) {
    const slugName = recipientIdOrEmail.replace(/-/g, ' ').trim();
    const peer = await this.prisma.user.findFirst({
      where: {
        OR: [
          { id: recipientIdOrEmail },
          { email: recipientIdOrEmail },
          { name: { equals: slugName, mode: 'insensitive' } },
        ],
      },
    });

    if (!peer) {
      throw new NotFoundException('Peer student not found');
    }

    if (peer.id === userId) {
      throw new BadRequestException('Cannot start a conversation with yourself');
    }

    // Check existing 1-on-1 conversation
    const existingConv = await this.prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId } } },
          { participants: { some: { userId: peer.id } } },
        ],
      },
      include: {
        participants: {
          include: { user: true },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (existingConv) {
      return this.formatConversation(existingConv, userId);
    }

    // Create new conversation with 2 participants
    const newConv = await this.prisma.conversation.create({
      data: {
        participants: {
          create: [
            { userId },
            { userId: peer.id },
          ],
        },
      },
      include: {
        participants: {
          include: { user: true },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    return this.formatConversation(newConv, userId);
  }

  /**
   * Retrieve message history for a conversation, ensuring participant authorization.
   */
  async getMessages(conversationId: string, userId: string) {
    const participant = await this.prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
    });

    if (!participant) {
      throw new ForbiddenException(
        'You are not authorized to view messages in this conversation',
      );
    }

    // Mark as read
    await this.prisma.conversationParticipant.update({
      where: { id: participant.id },
      data: { lastReadAt: new Date() },
    });

    const messages = await this.prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: { id: true, name: true, image: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return messages.map((m) => ({
      id: m.id,
      conversationId: m.conversationId,
      senderId: m.senderId,
      content: m.content,
      createdAt: m.createdAt.toISOString(),
      sender: m.sender,
    }));
  }

  /**
   * Save and return a new message in PostgreSQL.
   */
  async createMessage(conversationId: string, senderId: string, content: string) {
    const isParticipant = await this.prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId: senderId,
        },
      },
    });

    if (!isParticipant) {
      throw new ForbiddenException(
        'You are not authorized to send messages in this conversation',
      );
    }

    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderId,
        content: content.trim(),
      },
      include: {
        sender: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    // Update conversation timestamp
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
      sender: message.sender,
    };
  }

  private formatConversation(conv: any, currentUserId: string) {
    const peerPart = conv.participants.find((p: any) => p.userId !== currentUserId);
    const peer = peerPart?.user || conv.participants[0]?.user;
    const lastMsg = conv.messages?.[0] || null;

    return {
      id: conv.id,
      createdAt: conv.createdAt.toISOString(),
      updatedAt: conv.updatedAt.toISOString(),
      peer: {
        id: peer ? peer.id : 'unknown',
        name: peer ? peer.name : 'Campus Peer',
        email: peer ? peer.email : '',
        image: peer ? peer.image : null,
        department: peer ? peer.department : 'Engineering',
        yearOfStudy: peer ? peer.yearOfStudy : 3,
      },
      lastMessage: lastMsg
        ? {
            id: lastMsg.id,
            content: lastMsg.content,
            createdAt: lastMsg.createdAt.toISOString(),
            senderId: lastMsg.senderId,
          }
        : null,
      unreadCount: 0,
    };
  }
}
