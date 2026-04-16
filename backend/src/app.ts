import path from 'path';
import { fileURLToPath } from 'url';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
import CustomError from './utils/CustomError.js';
import config from './config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors({ origin: config.cors.origin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api', routes);

// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new CustomError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(errorHandler);

export default app;
