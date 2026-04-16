import mongoose from 'mongoose';
import config from './config/env.js';
import app from './app.js';

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.log('EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// 1. Connect to MongoDB
const DB = config.database.url;
mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!'))
  .catch((err: Error) => console.log('DB connection error: ', err));

// 2. Start Server
const port = config.port;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err: any) => {
  console.log('REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
