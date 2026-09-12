import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service.js';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:4000'],
    credentials: true,
  },
})
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  // Track active online users: userId -> Set of socket IDs
  private readonly onlineUsers = new Map<string, Set<string>>();

  constructor(private readonly messagesService: MessagesService) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.query['userId'] as string;
    if (userId) {
      if (!this.onlineUsers.has(userId)) {
        this.onlineUsers.set(userId, new Set());
      }
      this.onlineUsers.get(userId)!.add(client.id);
      this.broadcastOnlineStatus(userId, true);
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketSet] of this.onlineUsers.entries()) {
      if (socketSet.has(client.id)) {
        socketSet.delete(client.id);
        if (socketSet.size === 0) {
          this.onlineUsers.delete(userId);
          this.broadcastOnlineStatus(userId, false);
        }
        break;
      }
    }
  }

  @SubscribeMessage('join_conversation')
  handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; userId?: string },
  ) {
    if (data?.conversationId) {
      client.join(`conversation_${data.conversationId}`);
      return { status: 'joined', conversationId: data.conversationId };
    }
  }

  @SubscribeMessage('leave_conversation')
  handleLeaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    if (data?.conversationId) {
      client.leave(`conversation_${data.conversationId}`);
      return { status: 'left', conversationId: data.conversationId };
    }
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      conversationId: string;
      senderId: string;
      content: string;
      clientTempId?: string;
    },
  ) {
    if (!data?.conversationId || !data?.senderId || !data?.content) {
      return { status: 'error', message: 'Missing required parameters' };
    }

    const message = await this.messagesService.createMessage(
      data.conversationId,
      data.senderId,
      data.content,
    );

    // Broadcast instant real-time message to other room members (excluding the sender socket)
    client
      .to(`conversation_${data.conversationId}`)
      .emit('new_message', message);

    return { status: 'ok', message, clientTempId: data.clientTempId };
  }

  /**
   * Helper to broadcast a message created via REST to the socket room.
   */
  broadcastMessage(conversationId: string, message: any) {
    if (this.server) {
      this.server
        .to(`conversation_${conversationId}`)
        .emit('new_message', message);
    }
  }

  private broadcastOnlineStatus(userId: string, isOnline: boolean) {
    if (this.server) {
      this.server.emit('user_status', { userId, isOnline });
    }
  }
}
