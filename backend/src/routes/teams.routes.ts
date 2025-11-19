import express from 'express';
import { body } from 'express-validator';
import {
  getTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
  joinTeam,
  leaveTeam,
  generateInviteLink,
  joinByInviteCode,
} from '../controllers/teams.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Validation middleware
const createTeamValidation = [
  body('name').trim().notEmpty().withMessage('Team name is required'),
  body('description').optional().trim(),
];

// Routes
router.get('/', getTeams);
router.get('/:id', getTeam);
router.post('/', createTeamValidation, createTeam);
router.put('/:id', createTeamValidation, updateTeam);
router.delete('/:id', deleteTeam);
router.post('/:id/join', joinTeam);
router.post('/:id/leave', leaveTeam);
router.post('/:id/invite', generateInviteLink);
router.post('/invite/:code', joinByInviteCode);

export default router;
