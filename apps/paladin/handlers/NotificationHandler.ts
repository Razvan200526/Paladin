import { NotificationService } from '@paladin/services/NotificationService';
import {
  inject,
  logger,
  onClose,
  onMessage,
  onOpen,
  websocket,
} from '@razvan11/paladin';
import type { ServerWebSocket } from 'bun';

interface WSData {
  path: string;
  userId?: string;
}

@websocket('/ws')
export class NotificationHandler {
  constructor(
    @inject(NotificationService)
    private notificationService: NotificationService,
  ) {}

  @onOpen()
  handleOpen(_ws: ServerWebSocket<WSData>) {}

  @onMessage()
  handleMessage(ws: ServerWebSocket<WSData>, message: string | Buffer) {
    const messageStr =
      typeof message === 'string' ? message : message.toString();

    try {
      const data = JSON.parse(messageStr);

      switch (data.action) {
        case 'subscribe':
          if (data.userId) {
            ws.data.userId = data.userId;
            this.notificationService.registerConnection(
              data.userId,
              ws as unknown as WebSocket,
            );
            logger.info(`[WS] User ${data.userId} subscribed to notifications`);
          }
          break;

        case 'ping':
          ws.send(JSON.stringify({ type: 'pong' }));
          break;

        case 'acknowledge':
          if (data.notificationId && ws.data.userId) {
            this.notificationService.markAsRead(
              ws.data.userId,
              data.notificationId,
            );
          }
          break;

        default:
          logger.warn(`[WS] Unknown action: ${data.action}`);
      }
    } catch (error) {
      logger.error(new Error(`[WS] Error parsing message: ${error}`));
    }
  }

  @onClose()
  handleClose(ws: ServerWebSocket<WSData>) {
    const userId = (ws.data as WSData).userId;
    if (userId) {
      this.notificationService.unregisterConnection(
        userId,
        ws as unknown as WebSocket,
      );
      logger.info(`[WS] User ${userId} disconnected`);
    }
  }
}
