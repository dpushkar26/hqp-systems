import Fastify from 'fastify';
import fastifySocketIO from 'fastify-socket.io';
import dotenv from 'dotenv';
import path from 'path';
import { setupSocket } from './socket';
import { setupRedis } from './redis';
import cors from '@fastify/cors';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const app = Fastify({
  logger: true,
});

// Register CORS
app.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
});

// Register Socket.io with CORS allowing the frontend to connect
app.register(fastifySocketIO, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.get('/health', async (request, reply) => {
  return { status: 'ok' };
});

app.post('/internal/webhook', async (request, reply) => {
  const payload = request.body as any;
  if (!payload || !payload.hotelId) {
    return reply.status(400).send({ error: 'Missing hotelId' });
  }
  
  const roomName = `hotel:${payload.hotelId}`;
  
  // Distribute event to all connected clients in the hotel room
  if (payload.event === 'NEW_ORDER' || payload.event === 'order:update' || payload.event === 'PAYMENT_RECEIVED') {
    app.io.to(roomName).emit('order:update', payload);
  } else if (payload.event === 'reward:unlocked') {
    app.io.to(roomName).emit('reward:unlocked', payload);
  }

  return { success: true };
});

const start = async () => {
  try {
    setupSocket(app);
    setupRedis(app);

    const port = parseInt(process.env.PORT || '4000', 10);
    await app.listen({ port, host: '0.0.0.0' });
    app.log.info(`Realtime server running on port ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
