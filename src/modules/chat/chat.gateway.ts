import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  WsException,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import {
  GetGroupHistoryDto,
  GetHistoryDto,
  MessageDto,
  MessageGroupDto,
  ReadMessageDto,
} from './Dto';
import { Types } from 'mongoose';
import { Auth, IConversion, Sys_Role, UserRepository } from 'src/common';
import { PinoLogger } from 'nestjs-pino';
import { redis, redisKeys, TokenServices } from 'src/common/Utils/services';
import { Injectable, ParseIntPipe } from '@nestjs/common';
@Injectable()
@Auth(Sys_Role.user, Sys_Role.company_admin)
@WebSocketGateway({ cors: { origin: '*' }, namespace: '/chat' })
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer() server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly logger: PinoLogger,
    private readonly tokenService: TokenServices,
    private readonly userRepo: UserRepository,
  ) {}
  afterInit(server: Server) {
    this.logger.info('WebSocket server initialized');
  }
  async handleConnection(client: Socket) {
    try {
      let auth =
        client.handshake.auth?.authorization ||
        client.handshake.headers?.authorization;
      if (!auth) {
        this.logger.warn('Missing accessToken');
        client.disconnect();
        throw new WsException('forbidden: must provide accessToken');
      }
      if (auth.startsWith('Bearer ')) {
        auth = auth.split(' ')[1];
      }
      const decoded = this.tokenService.VerifyAccessToken(auth);
      const user = await this.userRepo.findById(decoded.id);
      if (!user) {
        client.disconnect();
        throw new WsException('forbidden: user not found');
      }
      client.data.user = user;
      await redis.sadd(redisKeys.socketKey(user.id), client.id);
      await redis.sadd(redisKeys.onlineUsers(), user.id);
      this.server.emit('user-online', { userId: user.id, name: user.name });
      this.logger.info(`Client connected: ${client.id}`);
      const conversations = await this.chatService.getUserConversations(
        user.id,
      );
      conversations.forEach((conv: IConversion) => {
        client.join((conv._id as unknown as string).toString());
      });
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      client.disconnect();
    }
  }
  async handleDisconnect(client: Socket) {
    try {
      const user = client.data.user;
      if (!user) return;
      await redis.srem(redisKeys.socketKey(user.id), client.id);
      const remainingSockets = await redis.smembers(
        redisKeys.socketKey(user.id),
      );
      if (remainingSockets.length === 0) {
        await redis.srem(redisKeys.onlineUsers(), user.id);
        this.server.emit('user-offline', { userId: user.id, name: user.name });
      }
      this.logger.info(`Client disconnected: ${client.id}`);
    } catch (error) {
      this.logger.error(`Disconnect error: ${error.message}`);
    }
  }
  private getUserId(socket: Socket): number {
    return socket.data.user.id;
  }
  private joinRoom(socket: Socket, roomId: string) {
    if (!socket.rooms.has(roomId)) {
      socket.join(roomId);
    }
  }
  @SubscribeMessage('send-private-message')
  async handlePrivateMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: MessageDto,
  ) {
    try {
      const user = socket.data.user;
      const conversation =
        await this.chatService.getOrCreatePrivateConversation(
          user.id,
          data.targetId,
        );
      const roomId = conversation._id.toString();
      this.joinRoom(socket, roomId);
      const message = await this.chatService.saveMessage(
        conversation._id,
        user.id,
        data.content,
      );
      this.server.to(roomId).emit('message-send', message);
    } catch (error) {
      this.logger.error(`send-private-message error: ${error.message},`);
      socket.emit('error', {
        event: 'send-private-message',
        message: error.message,
      });
    }
  }
  @SubscribeMessage('get-history')
  async handleGetHistory(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: GetHistoryDto,
  ) {
    try {
      const userId = this.getUserId(socket);
      const conversation =
        await this.chatService.getOrCreatePrivateConversation(
          userId,
          data.targetUserId,
        );
      const roomId = conversation._id.toString();
      const { messages, meta } = await this.chatService.getConversationMessages(
        roomId,
        data.cursor,
        data.limit,
      );
      this.joinRoom(socket, roomId);
      socket.emit('chat-history', {
        chat: messages,
        data: { targetUserId: data.targetUserId },
        meta: meta,
      });
    } catch (error) {
      this.logger.error(`get-history error: ${error.message}`);
      socket.emit('error', { event: 'get-history', message: error.message });
    }
  }
  @SubscribeMessage('send-group-message')
  async handleGroupMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: MessageGroupDto,
  ) {
    try {
      const userId = this.getUserId(socket);
      const isMember = await this.chatService.isUserInGroup(
        userId,
        data.targetId,
      );
      if (!isMember) {
        throw new WsException('غير مصرح: لست عضوًا في هذه المجموعة');
      }

      const conversation = await this.chatService.getGroupConversation(
        data.targetId,
      );
      const roomId = conversation._id.toString();
      this.joinRoom(socket, roomId);
      const message = await this.chatService.saveMessage(
        new Types.ObjectId(roomId),
        userId,
        data.content,
      );
      this.server.to(roomId).emit('message-send', message);
    } catch (error) {
      this.logger.error(`send-group-message error: ${error.message}`);
      socket.emit('error', {
        event: 'send-group-message',
        message: error.message,
      });
    }
  }
  @SubscribeMessage('get-group-history')
  async handleGroupHistory(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: GetGroupHistoryDto,
  ) {
    try {
      const userId = this.getUserId(socket);
      const isMember = await this.chatService.isUserInGroup(
        userId,
        new Types.ObjectId(data.targetGroupId),
      );
      if (!isMember) {
        throw new WsException('غير مصرح: لست عضوًا في هذه المجموعة');
      }
      const conversation = await this.chatService.getGroupConversation(
        data.targetGroupId,
      );
      const roomId = conversation._id.toString();
      const messages = await this.chatService.getConversationMessages(
        roomId,
        data.cursor,
        data.limit,
      );
      this.joinRoom(socket, roomId);
      socket.emit('group-chat-history', {
        chat: messages,
        data: { targetGroupId: data.targetGroupId },
      });
    } catch (error) {
      this.logger.error(`get-group-history error: ${error.message}`);
      socket.emit('error', {
        event: 'get-group-history',
        message: error.message,
      });
    }
  }
  @SubscribeMessage('mark-as-read')
  async handleMarkAsRead(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: ReadMessageDto,
  ) {
    const userId = this.getUserId(socket);
    const conversation = await this.chatService.getOrCreatePrivateConversation(
      userId,
      data.targetId,
    );
    const result = await this.chatService.markMessagesAsRead(
      conversation._id,
      userId,
    );
    if (result.modifiedCount > 0) {
      const senderSockets = await redis.smembers(
        redisKeys.socketKey(data.targetId),
      );
      for (const socketId of senderSockets) {
        this.server.to(socketId).emit('messages-read', {
          conversationId: conversation._id,
          readBy: userId,
        });
      }
    }
  }
}
