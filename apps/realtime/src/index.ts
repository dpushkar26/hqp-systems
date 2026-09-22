import Fastify from 'fastify';
import fastifySocketIO from 'fastify-socket.io';
import dotenv from 'dotenv';
import { setupSocket } from './socket';
import { setupRedis } from './redis';

dotenv.config();

const app = Fastify({
  logger: true,
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
