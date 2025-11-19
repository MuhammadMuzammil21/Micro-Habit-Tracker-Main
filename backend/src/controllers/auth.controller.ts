import { Response } from 'express';
import User from '../models/User';
import UserStats from '../models/UserStats';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.util';

export const signUp = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({
        success: false,
        error: 'Email already registered',
      });
      return;
    }

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      name: name || email.split('@')[0],
    });

    // Create user stats
    await UserStats.create({
      userId: user._id,
    });

    // Generate tokens
    const accessToken = generateAccessToken({
      id: user._id.toString(),
      email: user.email,
    });
    const refreshToken = generateRefreshToken({
      id: user._id.toString(),
      email: user.email,
    });

    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();

    // Return user data (without password)
    const userData = await User.findById(user._id).select('-password');

    res.status(201).json({
      success: true,
      data: {
        user: userData,
        accessToken,
        refreshToken,
      },
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
      error: error.message || 'Error creating user',
    });
  }
};

export const signIn = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
      return;
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      id: user._id.toString(),
      email: user.email,
    });
    const refreshToken = generateRefreshToken({
      id: user._id.toString(),
      email: user.email,
    });

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // Return user data (without password)
    const userData = await User.findById(user._id).select('-password');

    res.json({
      success: true,
      data: {
        user: userData,
        accessToken,
        refreshToken,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error signing in',
    });
  }
};

export const signOut = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (userId) {
      await User.findByIdAndUpdate(userId, { refreshToken: undefined });
    }

    res.json({
      success: true,
      message: 'Signed out successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error signing out',
    });
  }
};

export const refreshToken = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      res.status(400).json({
        success: false,
        error: 'Refresh token is required',
      });
      return;
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(token);

    // Find user and verify token matches
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) {
      res.status(401).json({
        success: false,
        error: 'Invalid refresh token',
      });
      return;
    }

    // Generate new tokens
    const accessToken = generateAccessToken({
      id: user._id.toString(),
      email: user.email,
    });
    const newRefreshToken = generateRefreshToken({
      id: user._id.toString(),
      email: user.email,
    });

    // Update refresh token
    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      success: true,
      data: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: 'Invalid refresh token',
    });
  }
};

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error fetching user',
    });
  }
};

