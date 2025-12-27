import { websocket, onMessage, onOpen, onClose, inject } from '@razvan11/paladin';
import type { ServerWebSocket } from 'bun';
import { NotificationService } from '@paladin/services/NotificationService';

interface WSData {
    path: string;
    userId?: string;
}

@websocket('/ws')
export class NotificationHandler {

    constructor(@inject(NotificationService) private notificationService: NotificationService) { }

    @onOpen()
    handleOpen(ws: ServerWebSocket<WSData>) {
        console.log('[WS] Client connected');
    }

    @onMessage()
    handleMessage(ws: ServerWebSocket<WSData>, message: string | Buffer) {
        const messageStr = typeof message === 'string' ? message : message.toString();

        try {
            const data = JSON.parse(messageStr);

            switch (data.action) {
                case 'subscribe':
                    if (data.userId) {
                        // Store userId in ws data
                        (ws.data as WSData).userId = data.userId;
                        // Register connection with NotificationService
                        this.notificationService.registerConnection(data.userId, ws as unknown as WebSocket);
                        console.log(`[WS] User ${data.userId} subscribed to notifications`);
                    }
                    break;

                case 'ping':
                    ws.send(JSON.stringify({ type: 'pong' }));
                    break;

                case 'acknowledge':
                    if (data.notificationId && (ws.data as WSData).userId) {
                        this.notificationService.markAsRead(
                            (ws.data as WSData).userId!,
                            data.notificationId
                        );
                    }
                    break;

                default:
                    console.log('[WS] Unknown action:', data.action);
            }
        } catch (error) {
            console.error('[WS] Error parsing message:', error);
        }
    }

    @onClose()
    handleClose(ws: ServerWebSocket<WSData>) {
        const userId = (ws.data as WSData).userId;
        if (userId) {
            this.notificationService.unregisterConnection(userId, ws as unknown as WebSocket);
            console.log(`[WS] User ${userId} disconnected`);
        }
    }
}
