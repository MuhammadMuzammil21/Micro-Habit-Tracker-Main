import { Response } from 'express';
import Notification from '../models/Notification';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

// Get all notifications for authenticated user
export const getNotifications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { type, read } = req.query;
    
    const filter: any = { userId };
    
    if (type) {
      filter.type = type;
    }
    
    if (read !== undefined) {
      filter.read = read === 'true';
    }
    
    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);
    
    const notificationsWithTime = notifications.map((notification) => {
      const timeDiff = Date.now() - notification.createdAt.getTime();
      const minutes = Math.floor(timeDiff / 60000);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      
      let time = '';
      if (days > 0) {
        time = `${days} day${days > 1 ? 's' : ''} ago`;
      } else if (hours > 0) {
        time = `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else if (minutes > 0) {
        time = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      } else {
        time = 'Just now';
      }
      
      return {
        id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        read: notification.read,
        time,
        metadata: notification.metadata,
        createdAt: notification.createdAt,
      };
    });
    
    res.json({
      success: true,
      data: notificationsWithTime,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error fetching notifications',
    });
  }
};

// Mark notification as read
export const markAsRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    
    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      res.status(404).json({
        success: false,
        error: 'Notification not found',
      });
      return;
    }
    
    res.json({
      success: true,
      data: notification,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error marking notification as read',
    });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    await Notification.updateMany(
      { userId, read: false },
      { read: true }
    );
    
    res.json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error marking all notifications as read',
    });
  }
};

// Delete notification
export const deleteNotification = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    
    const notification = await Notification.findOneAndDelete({ _id: id, userId });
    
    if (!notification) {
      res.status(404).json({
        success: false,
        error: 'Notification not found',
      });
      return;
    }
    
    res.json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error deleting notification',
    });
  }
};

// Get unread count
export const getUnreadCount = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    const count = await Notification.countDocuments({ userId, read: false });
    
    res.json({
      success: true,
      data: { count },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error fetching unread count',
    });
  }
};
