import mongoose, { Schema, Document } from 'mongoose';

export interface IHabitEntry extends Document {
  habitId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  completedAt: Date;
  notes?: string;
  createdAt: Date;
}

const HabitEntrySchema = new Schema<IHabitEntry>(
  {
    habitId: {
      type: Schema.Types.ObjectId,
      ref: 'Habit',
      required: [true, 'Habit ID is required'],
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    completedAt: {
      type: Date,
      required: [true, 'Completion date is required'],
      default: Date.now,
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
HabitEntrySchema.index({ habitId: 1, completedAt: -1 });
HabitEntrySchema.index({ userId: 1, completedAt: -1 });

export default mongoose.model<IHabitEntry>('HabitEntry', HabitEntrySchema);

