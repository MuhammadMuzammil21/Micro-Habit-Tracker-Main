import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'achievement' | 'team' | 'habit' | 'milestone';
  title: string;
  message: string;
  read: boolean;
  metadata?: {
    habitId?: mongoose.Types.ObjectId;
    teamId?: mongoose.Types.ObjectId;
    streakCount?: number;
  };
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    type: {
      type: String,
      enum: ['achievement', 'team', 'habit', 'milestone'],
      required: [true, 'Notification type is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    metadata: {
      habitId: {
        type: Schema.Types.ObjectId,
        ref: 'Habit',
      },
      teamId: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
      },
      streakCount: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
NotificationSchema.index({ userId: 1, read: 1 });
NotificationSchema.index({ userId: 1, createdAt: -1 });
// TTL index: auto-delete after 90 days
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

export default mongoose.model<INotification>('Notification', NotificationSchema);

