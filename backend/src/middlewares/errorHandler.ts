import { Request, Response, NextFunction } from 'express';
import CustomError from '../utils/CustomError.js';

interface ErrorResponse extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

const errorHandler = (err: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';

  res.status(statusCode).json({
    status: status,
    error: err,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export default errorHandler;
