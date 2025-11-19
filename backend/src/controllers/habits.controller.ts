import { Response } from 'express';
import Habit from '../models/Habit';
import HabitEntry from '../models/HabitEntry';
import User from '../models/User';
import TeamMember from '../models/TeamMember';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { getIO } from '../config/socket';

// Get all habits for authenticated user
export const getHabits = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    const habits = await Habit.find({ userId, isActive: true })
      .populate('teamId', 'name')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: habits,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error fetching habits',
    });
  }
};

// Get single habit
export const getHabit = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    
    const habit = await Habit.findOne({ _id: id, userId });
    
    if (!habit) {
      res.status(404).json({
        success: false,
        error: 'Habit not found',
      });
      return;
    }
    
    res.json({
      success: true,
      data: habit,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error fetching habit',
    });
  }
};

// Create a new habit
export const createHabit = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { title, description, frequency, teamId, color, reminderTime } = req.body;
    
    const habit = await Habit.create({
      userId,
      title,
      description,
      frequency: frequency || 'daily',
      teamId: teamId || undefined,
      color,
      reminderTime: reminderTime || undefined,
    });
    
    res.status(201).json({
      success: true,
      data: habit,
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      res.status(400).json({
        success: false,
        error: Object.values(error.errors).map((e: any) => e.message).join(', '),
      });
      return;
    }
    res.status(500).json({
      success: false,
      error: error.message || 'Error creating habit',
    });
  }
};

// Update habit
export const updateHabit = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { title, description, frequency, color, reminderTime } = req.body;
    
    const habit = await Habit.findOneAndUpdate(
      { _id: id, userId },
      { title, description, frequency, color, reminderTime },
      { new: true, runValidators: true }
    );
    
    if (!habit) {
      res.status(404).json({
        success: false,
        error: 'Habit not found',
      });
      return;
    }
    
    res.json({
      success: true,
      data: habit,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error updating habit',
    });
  }
};

// Delete habit
export const deleteHabit = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    
    const habit = await Habit.findOneAndUpdate(
      { _id: id, userId },
      { isActive: false },
      { new: true }
    );
    
    if (!habit) {
      res.status(404).json({
        success: false,
        error: 'Habit not found',
      });
      return;
    }
    
    res.json({
      success: true,
      message: 'Habit deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error deleting habit',
    });
  }
};

// Mark habit as completed
export const completeHabit = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { habitId } = req.params;
    const { notes } = req.body;
    
    // Verify habit exists and user has access (either owner or team member)
    const habit = await Habit.findById(habitId);
    if (!habit) {
      res.status(404).json({
        success: false,
        error: 'Habit not found',
      });
      return;
    }

    // Check if user owns the habit or is a member of the team
    if (habit.userId.toString() !== userId) {
      if (habit.teamId) {
        // Check if user is a member of the team
        const membership = await TeamMember.findOne({
          teamId: habit.teamId,
          userId,
          status: 'active',
        });
        if (!membership) {
          res.status(403).json({
            success: false,
            error: 'You do not have access to this habit',
          });
          return;
        }
      } else {
        res.status(403).json({
          success: false,
          error: 'You do not have access to this habit',
        });
        return;
      }
    }
    
    // Create entry for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if already completed today
    const existingEntry = await HabitEntry.findOne({
      habitId,
      userId,
      completedAt: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });
    
    if (existingEntry) {
      res.status(400).json({
        success: false,
        error: 'Habit already completed today',
      });
      return;
    }
    
    const entry = await HabitEntry.create({
      habitId,
      userId,
      completedAt: today,
      notes,
    });

    // Get user info for socket emission
    const user = await User.findById(userId).select('name email');

    // Emit real-time event to user's personal room
    const io = getIO();
    io.to(`user:${userId}`).emit('habit_completed', {
      habitId: habit?._id,
      habitTitle: habit?.title,
      userId,
      userName: user?.name,
      completedAt: entry.completedAt,
    });

    // If it's a team habit, emit to team room
    if (habit?.teamId) {
      const teamId = habit.teamId.toString();
      
      // Get team members to notify
      const teamMembers = await TeamMember.find({ 
        teamId: habit.teamId, 
        status: 'active' 
      }).select('userId');
      
      const memberIds = teamMembers.map(tm => tm.userId.toString());
      
      // Emit to team room
      io.to(`team:${teamId}`).emit('update_feed', {
        id: entry._id,
        userName: user?.name || 'Unknown User',
        habitTitle: habit.title,
        timestamp: 'Just now',
        habitId: habit._id,
        userId,
      });

      // Emit leaderboard update to team
      io.to(`team:${teamId}`).emit('team_leaderboard_update', {
        teamId,
      });
    }
    
    // TODO: Update user stats and check for streaks
    // This would be handled by a service
    
    res.json({
      success: true,
      data: entry,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error completing habit',
    });
  }
};

