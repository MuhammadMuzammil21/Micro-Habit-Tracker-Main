import mongoose, { Schema, Document } from 'mongoose';

export interface IHabit extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly';
  isActive: boolean;
  teamId?: mongoose.Types.ObjectId;
  color?: string;
  reminderTime?: string; // Format: "HH:mm" (e.g., "08:00", "09:30")
  createdAt: Date;
  updatedAt: Date;
}

const HabitSchema = new Schema<IHabit>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Habit title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly'],
      required: [true, 'Frequency is required'],
      default: 'daily',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      index: true,
      sparse: true, // Only index if value exists
    },
    color: {
      type: String,
      match: [/^#[0-9A-F]{6}$/i, 'Color must be a valid hex code'],
    },
    reminderTime: {
      type: String,
      match: [/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Reminder time must be in HH:mm format'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
HabitSchema.index({ userId: 1, isActive: 1 });
HabitSchema.index({ teamId: 1 });

export default mongoose.model<IHabit>('Habit', HabitSchema);

