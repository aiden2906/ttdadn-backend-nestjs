import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger('AppGateWay');

  @WebSocketServer() wss: Server;

  handleDisconnect(): void {
    this.logger.log('Disconnected');
  }
  handleConnection(): void {
    this.logger.log('Connected');
  }

  afterInit(): void {
    this.logger.log('Initialized!');
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, text: string): void {
    this.wss.emit('msgToClient', text);
  }
}
