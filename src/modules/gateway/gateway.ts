import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { PinoLogger } from 'nestjs-pino';
import {Auth, type IApplication, type INotification, Sys_Role, UserRepository } from 'src/common';
import { Server, Socket } from 'socket.io';
import { redis, redisKeys, TokenServices } from 'src/common/Utils/services';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
@Injectable()
@Auth(Sys_Role.user, Sys_Role.admin, Sys_Role.company_admin)
@WebSocketGateway({ namespace: `public`, cors: { origin: '*' } })
export class Gateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  private readonly server: Server;
  constructor(
    private readonly logger: PinoLogger,
    private readonly tokenService: TokenServices,
    private readonly userRepo: UserRepository,
  ) {}

  afterInit(server: Server) {
    this.logger.info('WebSocket server initialized');
  }
  async handleConnection(client: Socket) {
    let auth =
      client.handshake.auth?.authorization ||
      client.handshake.headers?.authorization;
    if (!auth) {
      this.logger.warn('Missing accessToken');
      client.disconnect();
      throw new WsException('forbidden must provide accessToken');
    }
    if (auth.startsWith('Bearer ')) {
      auth = auth.split(' ')[1];
    }
    const decoded = this.tokenService.VerifyAccessToken(auth);
    const user = await this.userRepo.findById(decoded.id);
    client.data.user = user;
    await redis.sadd(redisKeys.socketKey(user.id), client.id);
    this.logger.info(`Client connected: ${client.id}`);
  }
  async handleDisconnect(client: Socket) {
    const user = client.data.user;
    await redis.srem(redisKeys.socketKey(user.id), client.id);
    this.logger.info(`Client disconnected: ${client.id}`);
  }
  @OnEvent('notification.send')
  async sendNotification(payload: {
    userId: number;
    notification: INotification;
  }) {
    const { userId, notification } = payload
    const Ids = await redis.smembers(redisKeys.socketKey(userId));
    for (const socketId of Ids) {
      const client = this.server.to(socketId);
      if (!client) {
        await redis.srem(redisKeys.socketKey(userId), socketId);
        continue;
      }
      await this.server.to(socketId).emit('notification', {
        title: notification.title,
        content: notification.content,
      });
    }
  }
  async userApplication(adminId: number, application: IApplication) {
    const Ids = await redis.smembers(redisKeys.socketKey(adminId));
    for (const socketId of Ids) {
      const client = this.server.to(socketId);
      if (!client) {
        await redis.srem(redisKeys.socketKey(adminId), socketId);
        continue;
      }
      await this.server.to(socketId).emit('application', {
        application,
      });
    }
  }
}
