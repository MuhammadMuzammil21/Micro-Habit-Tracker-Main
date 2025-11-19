import express from 'express';
import { body } from 'express-validator';
import {
  getHabits,
  getHabit,
  createHabit,
  updateHabit,
  deleteHabit,
  completeHabit,
} from '../controllers/habits.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Validation middleware
const createHabitValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('frequency').optional().isIn(['daily', 'weekly']),
];

// Routes
router.get('/', getHabits);
router.get('/:id', getHabit);
router.post('/', createHabitValidation, createHabit);
router.put('/:id', createHabitValidation, updateHabit);
router.delete('/:id', deleteHabit);
router.post('/:habitId/complete', completeHabit);

export default router;

