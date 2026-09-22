import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseRealtimeOptions {
  hotelId: string;
  onOrderUpdate?: (order: any) => void;
  onRewardUnlocked?: (reward: any) => void;
}

const REALTIME_URL = process.env.NEXT_PUBLIC_REALTIME_URL || 'http://localhost:4000';

export function useRealtime({ hotelId, onOrderUpdate, onRewardUnlocked }: UseRealtimeOptions) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!hotelId) return;

    const socketInstance = io(REALTIME_URL, {
      withCredentials: true,
      transports: ['websocket'],
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      socketInstance.emit('join:hotel', hotelId);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    socketInstance.on('order:update', (payload) => {
      if (onOrderUpdate) onOrderUpdate(payload);
    });

    socketInstance.on('reward:unlocked', (payload) => {
      if (onRewardUnlocked) onRewardUnlocked(payload);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.emit('leave:hotel', hotelId);
      socketInstance.disconnect();
    };
  }, [hotelId, onOrderUpdate, onRewardUnlocked]);

  return { socket, isConnected };
}
