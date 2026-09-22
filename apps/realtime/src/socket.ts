import { Server, Socket } from 'socket.io';
import { FastifyInstance } from 'fastify';
import 'fastify-socket.io';

export function setupSocket(app: FastifyInstance) {
  app.ready((err) => {
    if (err) throw err;

    app.io.on('connection', (socket: Socket) => {
      app.log.info(`Socket connected: ${socket.id}`);

      // Clients should emit this event with their hotelId to join the specific room
      socket.on('join:hotel', (hotelId: string) => {
        const roomName = `hotel:${hotelId}`;
        socket.join(roomName);
        app.log.info(`Socket ${socket.id} joined room ${roomName}`);
      });

      socket.on('leave:hotel', (hotelId: string) => {
        const roomName = `hotel:${hotelId}`;
        socket.leave(roomName);
        app.log.info(`Socket ${socket.id} left room ${roomName}`);
      });

      socket.on('disconnect', () => {
        app.log.info(`Socket disconnected: ${socket.id}`);
      });
    });
  });
}
