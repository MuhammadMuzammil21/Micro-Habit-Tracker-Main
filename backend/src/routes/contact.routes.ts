import express from 'express';
import { body } from 'express-validator';
import { sendContactMessage } from '../controllers/contact.controller';

const router = express.Router();

// Validation middleware
const contactValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name must be less than 100 characters'),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required')
    .isLength({ max: 255 })
    .withMessage('Email must be less than 255 characters'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10 })
    .withMessage('Message must be at least 10 characters')
    .isLength({ max: 1000 })
    .withMessage('Message must be less than 1000 characters'),
];

// Routes
router.post('/', contactValidation, sendContactMessage);

export default router;

