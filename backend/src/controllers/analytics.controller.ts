import { Response } from 'express';
import Habit from '../models/Habit';
import HabitEntry from '../models/HabitEntry';
import UserStats from '../models/UserStats';
import TeamMember from '../models/TeamMember';
import User from '../models/User';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

// Get user stats
export const getUserStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    let userStats = await UserStats.findOne({ userId });
    
    if (!userStats) {
      // Create initial stats if not exists
      userStats = await UserStats.create({ userId });
    }
    
    // Get additional real-time stats
    const totalHabits = await Habit.countDocuments({ userId });
    const activeHabits = await Habit.countDocuments({ userId, isActive: true });
    const totalCompletions = await HabitEntry.countDocuments({ userId });
    
    // Calculate current streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayCompletions = await HabitEntry.countDocuments({
      userId,
      completedAt: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });
    
    res.json({
      success: true,
      data: {
        totalHabits,
        activeHabits,
        totalCompletions,
        longestStreak: userStats.longestStreak,
        currentStreak: userStats.currentStreak,
        completionRate: userStats.completionRate,
        todayCompletions,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error fetching user stats',
    });
  }
};

// Get weekly progress
export const getWeeklyProgress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 6);
    
    const activeHabitsCount = await Habit.countDocuments({ userId, isActive: true });
    
    const weeklyData = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekAgo);
      date.setDate(date.getDate() + i);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      const completed = await HabitEntry.countDocuments({
        userId,
        completedAt: {
          $gte: date,
          $lt: nextDay,
        },
      });
      
      weeklyData.push({
        day: days[date.getDay()],
        completed,
        total: activeHabitsCount,
      });
    }
    
    res.json({
      success: true,
      data: weeklyData,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error fetching weekly progress',
    });
  }
};

// Get habit breakdown
export const getHabitBreakdown = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    const habits = await Habit.find({ userId, isActive: true }).limit(10);
    
    const habitBreakdown = await Promise.all(
      habits.map(async (habit) => {
        const totalEntries = await HabitEntry.countDocuments({ habitId: habit._id });
        
        // Calculate completion rate based on days since creation
        const daysSinceCreation = Math.floor(
          (Date.now() - habit.createdAt.getTime()) / (1000 * 60 * 60 * 24)
        );
        const expectedCompletions = habit.frequency === 'daily' 
          ? daysSinceCreation 
          : Math.floor(daysSinceCreation / 7);
        
        const completionRate = expectedCompletions > 0 
          ? Math.min(Math.round((totalEntries / expectedCompletions) * 100), 100)
          : 0;
        
        return {
          name: habit.title,
          value: completionRate,
          color: habit.color || 'hsl(var(--primary))',
        };
      })
    );
    
    res.json({
      success: true,
      data: habitBreakdown,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error fetching habit breakdown',
    });
  }
};

// Get monthly trend
export const getMonthlyTrend = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    const monthlyData = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);
      monthEnd.setHours(23, 59, 59, 999);
      
      const completions = await HabitEntry.countDocuments({
        userId,
        completedAt: {
          $gte: monthStart,
          $lte: monthEnd,
        },
      });
      
      const daysInMonth = monthEnd.getDate();
      const activeHabits = await Habit.countDocuments({ 
        userId, 
        isActive: true,
        createdAt: { $lte: monthEnd },
      });
      
      const expectedCompletions = daysInMonth * activeHabits;
      const rate = expectedCompletions > 0 
        ? Math.round((completions / expectedCompletions) * 100)
        : 0;
      
      monthlyData.push({
        month: months[monthStart.getMonth()],
        rate: Math.min(rate, 100),
      });
    }
    
    res.json({
      success: true,
      data: monthlyData,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error fetching monthly trend',
    });
  }
};

// Get team leaderboard
export const getTeamLeaderboard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { teamId } = req.params;
    
    // Verify user is member of the team
    const membership = await TeamMember.findOne({ 
      teamId, 
      userId, 
      status: 'active' 
    });
    
    if (!membership) {
      res.status(403).json({
        success: false,
        error: 'You are not a member of this team',
      });
      return;
    }
    
    // Get all active team members
    const teamMembers = await TeamMember.find({ 
      teamId, 
      status: 'active' 
    }).populate('userId', 'name email');
    
    const leaderboard = await Promise.all(
      teamMembers.map(async (member) => {
        const memberId = (member.userId as any)._id;
        const memberName = (member.userId as any).name;
        
        const userStats = await UserStats.findOne({ userId: memberId });
        
        return {
          name: memberName,
          streak: userStats?.currentStreak || 0,
          completionRate: userStats?.completionRate || 0,
        };
      })
    );
    
    // Sort by streak descending
    leaderboard.sort((a, b) => b.streak - a.streak);
    
    res.json({
      success: true,
      data: leaderboard,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error fetching team leaderboard',
    });
  }
};

// Get team feed (recent completions)
export const getTeamFeed = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    // Get all teams user is part of
    const teamMembers = await TeamMember.find({ 
      userId, 
      status: 'active' 
    }).select('teamId');
    
    const teamIds = teamMembers.map(tm => tm.teamId);
    
    // Get recent habit entries from team habits
    const recentEntries = await HabitEntry.find({
      habitId: { 
        $in: await Habit.find({ 
          teamId: { $in: teamIds },
          isActive: true 
        }).distinct('_id')
      },
    })
      .sort({ completedAt: -1 })
      .limit(20)
      .populate('userId', 'name')
      .populate('habitId', 'title');
    
    const feedItems = recentEntries.map((entry) => {
      const userName = (entry.userId as any)?.name || 'Unknown User';
      const habitTitle = (entry.habitId as any)?.title || 'Unknown Habit';
      
      const timeDiff = Date.now() - entry.completedAt.getTime();
      const minutes = Math.floor(timeDiff / 60000);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      
      let timestamp = '';
      if (days > 0) {
        timestamp = `${days} day${days > 1 ? 's' : ''} ago`;
      } else if (hours > 0) {
        timestamp = `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else if (minutes > 0) {
        timestamp = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      } else {
        timestamp = 'Just now';
      }
      
      return {
        id: entry._id,
        userName,
        habitTitle,
        timestamp,
      };
    });
    
    res.json({
      success: true,
      data: feedItems,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error fetching team feed',
    });
  }
};
