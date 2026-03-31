import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/',
})
export class EventsGateway implements OnGatewayConnection {
  private readonly logger = new Logger(EventsGateway.name);

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const userId =
      (client.handshake.auth?.userId as string) ||
      (client.handshake.query?.userId as string);
    if (userId) {
      void client.join(`user:${userId}`);
      this.logger.debug(`Client ${client.id} joined user:${userId}`);
    }
  }

  emitToUser(userId: string, event: string, payload: unknown) {
    this.server?.to(`user:${userId}`).emit(event, payload);
  }

  emitScoreAlert(userId: string, event: string, payload: unknown) {
    this.emitToUser(userId, event, payload);
    this.emitToUser(userId, 'score:updated', { at: new Date().toISOString() });
  }
}
