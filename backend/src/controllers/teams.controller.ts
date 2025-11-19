import { Response } from 'express';
import Team from '../models/Team';
import TeamMember from '../models/TeamMember';
import Habit from '../models/Habit';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

// Get all teams for authenticated user
export const getTeams = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    // Find all teams where user is a member
    const teamMembers = await TeamMember.find({ 
      userId, 
      status: 'active' 
    }).select('teamId role');
    
    const teamIds = teamMembers.map(tm => tm.teamId);
    
    const teams = await Team.find({ 
      _id: { $in: teamIds },
      isActive: true 
    }).populate('createdBy', 'name email');
    
    // Get member counts and active habits for each team
    const teamsWithStats = await Promise.all(
      teams.map(async (team) => {
        const memberCount = await TeamMember.countDocuments({ 
          teamId: team._id, 
          status: 'active' 
        });
        
        const activeHabits = await Habit.countDocuments({ 
          teamId: team._id, 
          isActive: true 
        });
        
        const members = await TeamMember.find({ 
          teamId: team._id, 
          status: 'active' 
        })
          .populate('userId', 'name email')
          .limit(8);
        
        const teamMember = teamMembers.find(tm => tm.teamId.toString() === team._id.toString());
        
        return {
          id: team._id,
          name: team.name,
          description: team.description,
          memberCount,
          activeHabits,
          isAdmin: teamMember?.role === 'admin',
          members: members.map(m => ({
            id: m.userId._id,
            name: (m.userId as any).name,
            email: (m.userId as any).email,
          })),
          createdAt: team.createdAt,
        };
      })
    );
    
    res.json({
      success: true,
      data: teamsWithStats,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error fetching teams',
    });
  }
};

// Get single team
export const getTeam = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    
    const team = await Team.findOne({ _id: id, isActive: true })
      .populate('createdBy', 'name email');
    
    if (!team) {
      res.status(404).json({
        success: false,
        error: 'Team not found',
      });
      return;
    }
    
    // Check if user is a member
    const membership = await TeamMember.findOne({ 
      teamId: id, 
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
    
    const memberCount = await TeamMember.countDocuments({ 
      teamId: id, 
      status: 'active' 
    });
    
    const activeHabits = await Habit.countDocuments({ 
      teamId: id, 
      isActive: true 
    });
    
    const members = await TeamMember.find({ 
      teamId: id, 
      status: 'active' 
    }).populate('userId', 'name email');
    
    res.json({
      success: true,
      data: {
        id: team._id,
        name: team.name,
        description: team.description,
        memberCount,
        activeHabits,
        isAdmin: membership.role === 'admin',
        members: members.map(m => ({
          id: m.userId._id,
          name: (m.userId as any).name,
          email: (m.userId as any).email,
          role: m.role,
          joinedAt: m.joinedAt,
        })),
        settings: team.settings,
        createdAt: team.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error fetching team',
    });
  }
};

// Create a new team
export const createTeam = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { name, description, settings } = req.body;
    
    const team = await Team.create({
      name,
      description,
      createdBy: userId,
      settings: settings || {},
    });
    
    // Add creator as admin member
    await TeamMember.create({
      teamId: team._id,
      userId,
      role: 'admin',
      status: 'active',
    });
    
    res.status(201).json({
      success: true,
      data: team,
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
      error: error.message || 'Error creating team',
    });
  }
};

// Update team
export const updateTeam = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { name, description, settings } = req.body;
    
    // Check if user is admin
    const membership = await TeamMember.findOne({ 
      teamId: id, 
      userId, 
      role: 'admin',
      status: 'active' 
    });
    
    if (!membership) {
      res.status(403).json({
        success: false,
        error: 'Only team admins can update team details',
      });
      return;
    }
    
    const team = await Team.findByIdAndUpdate(
      id,
      { name, description, settings },
      { new: true, runValidators: true }
    );
    
    if (!team) {
      res.status(404).json({
        success: false,
        error: 'Team not found',
      });
      return;
    }
    
    res.json({
      success: true,
      data: team,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error updating team',
    });
  }
};

// Delete team
export const deleteTeam = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    
    // Check if user is admin
    const membership = await TeamMember.findOne({ 
      teamId: id, 
      userId, 
      role: 'admin',
      status: 'active' 
    });
    
    if (!membership) {
      res.status(403).json({
        success: false,
        error: 'Only team admins can delete the team',
      });
      return;
    }
    
    const team = await Team.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    
    if (!team) {
      res.status(404).json({
        success: false,
        error: 'Team not found',
      });
      return;
    }
    
    res.json({
      success: true,
      message: 'Team deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error deleting team',
    });
  }
};

// Join team
export const joinTeam = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    
    const team = await Team.findOne({ _id: id, isActive: true });
    
    if (!team) {
      res.status(404).json({
        success: false,
        error: 'Team not found',
      });
      return;
    }
    
    // Check if already a member
    const existingMember = await TeamMember.findOne({ 
      teamId: id, 
      userId 
    });
    
    if (existingMember && existingMember.status === 'active') {
      res.status(400).json({
        success: false,
        error: 'You are already a member of this team',
      });
      return;
    }
    
    const status = team.settings.requireApproval ? 'pending' : 'active';
    
    if (existingMember) {
      existingMember.status = status;
      await existingMember.save();
    } else {
      await TeamMember.create({
        teamId: id,
        userId,
        role: 'member',
        status,
      });
    }
    
    res.json({
      success: true,
      message: status === 'pending' 
        ? 'Join request sent. Waiting for admin approval.' 
        : 'Successfully joined the team',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error joining team',
    });
  }
};

// Leave team
export const leaveTeam = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    
    const membership = await TeamMember.findOneAndUpdate(
      { teamId: id, userId },
      { status: 'left' },
      { new: true }
    );
    
    if (!membership) {
      res.status(404).json({
        success: false,
        error: 'You are not a member of this team',
      });
      return;
    }
    
    res.json({
      success: true,
      message: 'Successfully left the team',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error leaving team',
    });
  }
};
