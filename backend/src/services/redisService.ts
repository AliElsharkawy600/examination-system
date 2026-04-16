import { createClient, RedisClientType } from 'redis';
import config from '../config/env.js';

const client: RedisClientType = createClient({
  url: config.redis.url
});

let hasLoggedWarning = false;
client.on('error', (err: any) => {
  if (err.code === 'ECONNREFUSED') {
    if (!hasLoggedWarning) {
      console.warn(`Redis connection refused at ${config.redis.url}. Timer features will be disabled.`);
      hasLoggedWarning = true;
    }
  } else {
    console.error('Redis Client Error:', err);
  }
});

// Fallback memory store for when Redis is unavailable
const memoryBackup = new Map<string, number>();

// Initialize connection
(async () => {
  try {
    await client.connect();
  } catch (err) {
    // Error is handled by the client listener
  }
})();

export const startTimer = async (studentId: string, examId: string, ttl: number = 3600): Promise<number> => {
  const key = `exam:${studentId}:${examId}`;
  const startTime = Date.now();
  
  if (client.isReady) {
    try {
      await client.setEx(key, ttl, startTime.toString());
    } catch (err) {
      console.error('Redis error, using memory backup');
      memoryBackup.set(key, startTime);
    }
  } else {
    memoryBackup.set(key, startTime);
  }
  
  return startTime;
};

export const getStartTime = async (studentId: string, examId: string): Promise<number | null> => {
  const key = `exam:${studentId}:${examId}`;
  
  if (client.isReady) {
    try {
      const startTime = await client.get(key);
      if (startTime) return parseInt(startTime, 10);
    } catch (err) {
      // Fall through to memory backup
    }
  }
  
  return memoryBackup.get(key) || null;
};

export const deleteTimer = async (studentId: string, examId: string): Promise<void> => {
  const key = `exam:${studentId}:${examId}`;
  
  if (client.isReady) {
    try {
      await client.del(key);
    } catch (err) {
      // Fall through
    }
  }
  memoryBackup.delete(key);
};

export { client };
