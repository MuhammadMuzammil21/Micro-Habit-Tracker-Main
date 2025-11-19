import express from 'express';
import {
  getUserStats,
  getWeeklyProgress,
  getHabitBreakdown,
  getMonthlyTrend,
  getTeamLeaderboard,
  getTeamFeed,
} from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Routes
router.get('/stats', getUserStats);
router.get('/weekly', getWeeklyProgress);
router.get('/breakdown', getHabitBreakdown);
router.get('/trend', getMonthlyTrend);
router.get('/team/:teamId/leaderboard', getTeamLeaderboard);
router.get('/feed', getTeamFeed);

export default router;
