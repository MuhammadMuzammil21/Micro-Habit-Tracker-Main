import mongoose, { Schema, Document } from 'mongoose';

export interface IUserStats extends Document {
  userId: mongoose.Types.ObjectId;
  totalHabits: number;
  activeHabits: number;
  totalCompletions: number;
  longestStreak: number;
  currentStreak: number;
  completionRate: number; // percentage (0-100)
  lastUpdated: Date;
}

const UserStatsSchema = new Schema<IUserStats>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
      index: true,
    },
    totalHabits: {
      type: Number,
      default: 0,
      min: 0,
    },
    activeHabits: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalCompletions: {
      type: Number,
      default: 0,
      min: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    currentStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    completionRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  }
);

// Unique index on userId
UserStatsSchema.index({ userId: 1 }, { unique: true });

export default mongoose.model<IUserStats>('UserStats', UserStatsSchema);

