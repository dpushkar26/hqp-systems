import Redis from 'ioredis';
import { FastifyInstance } from 'fastify';
import 'fastify-socket.io';

export function setupRedis(app: FastifyInstance) {
  const host = process.env.REDIS_HOST;
  const port = process.env.REDIS_PORT;
  const password = process.env.REDIS_PASSWORD;

  const redisUrl = host && password 
    ? `rediss://default:${password}@${host}:${port || 6379}`
    : 'redis://localhost:6379';
  
  const redis = new Redis(redisUrl);

  redis.on('connect', () => {
    app.log.info('Connected to Redis');
  });

  redis.on('error', (err) => {
    app.log.error(`Redis connection error: ${err.message}`);
  });

  // Subscribe to all hotel order events and reward events
  redis.psubscribe('hotel:*:orders', 'hotel:*:reward-unlocked', (err, count) => {
    if (err) {
      app.log.error(`Failed to subscribe: ${err.message}`);
      return;
    }
    app.log.info(`Subscribed to ${count} channels.`);
  });

  redis.on('pmessage', (pattern, channel, message) => {
    app.log.info(`Received message from ${channel}`);
    
    // channel format is 'hotel:<hotelId>:orders' or 'hotel:<hotelId>:reward-unlocked'
    const parts = channel.split(':');
    if (parts.length >= 3) {
      const hotelId = parts[1];
      const eventType = parts[2]; // 'orders' or 'reward-unlocked'

      try {
        const payload = JSON.parse(message);
        const roomName = `hotel:${hotelId}`;
        
        // Push the event to all sockets connected to this hotel's room
        if (eventType === 'orders') {
          app.io.to(roomName).emit('order:update', payload);
        } else if (eventType === 'reward-unlocked') {
          app.io.to(roomName).emit('reward:unlocked', payload);
        }
      } catch (err) {
        app.log.error(`Failed to parse message from ${channel}: ${message}`);
      }
    }
  });
}
