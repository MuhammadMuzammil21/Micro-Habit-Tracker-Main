import express from 'express';
import { body } from 'express-validator';
import {
  signUp,
  signIn,
  signOut,
  refreshToken,
  getCurrentUser,
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Validation middleware
const signUpValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').optional().trim(),
];

const signInValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

// Routes
router.post('/signup', signUpValidation, signUp);
router.post('/signin', signInValidation, signIn);
router.post('/signout', authenticate, signOut);
router.post('/refresh', refreshToken);
router.get('/me', authenticate, getCurrentUser);

export default router;

