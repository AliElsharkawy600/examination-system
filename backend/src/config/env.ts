import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

interface Config {
  env: string;
  port: number;
  database: {
    url: string;
  };
  redis: {
    url: string;
  };
  cors: {
    origin: string;
  };
}

const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  database: {
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017/examination-system',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
};

export default config;
