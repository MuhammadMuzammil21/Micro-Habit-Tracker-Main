import mongoose, { Schema, Document } from 'mongoose';

export interface ITeamMember extends Document {
  teamId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  role: 'admin' | 'member';
  status: 'active' | 'pending' | 'left';
  joinedAt: Date;
}

const TeamMemberSchema = new Schema<ITeamMember>(
  {
    teamId: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: [true, 'Team ID is required'],
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member',
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'left'],
      default: 'pending',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  }
);

// Unique compound index: one user can only be in a team once
TeamMemberSchema.index({ teamId: 1, userId: 1 }, { unique: true });

export default mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);

