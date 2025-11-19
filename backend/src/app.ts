import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import connectDB from './config/database';
import { errorHandler, notFound } from './middleware/error.middleware';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.routes';
import habitsRoutes from './routes/habits.routes';

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8080',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitsRoutes);
app.use('/api/teams', (req, res) => {
  res.status(501).json({ success: false, error: 'Not implemented yet' });
});
app.use('/api/analytics', (req, res) => {
  res.status(501).json({ success: false, error: 'Not implemented yet' });
});
app.use('/api/notifications', (req, res) => {
  res.status(501).json({ success: false, error: 'Not implemented yet' });
});
app.use('/api/contact', (req, res) => {
  res.status(501).json({ success: false, error: 'Not implemented yet' });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

export default app;

