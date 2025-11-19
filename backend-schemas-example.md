# MongoDB Schemas - Example Implementation

## Mongoose Model Examples

### 1. User Model (`backend/src/models/User.ts`)

```typescript
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  name?: string;
  avatarUrl?: string;
  emailVerified: boolean;
  verificationToken?: string;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    name: {
      type: String,
      trim: true,
    },
    avatarUrl: {
      type: String,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ refreshToken: 1 });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
```

---

### 2. Habit Model (`backend/src/models/Habit.ts`)

```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IHabit extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly';
  isActive: boolean;
  teamId?: mongoose.Types.ObjectId;
  color?: string;
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
  },
  {
    timestamps: true,
  }
);

// Indexes
HabitSchema.index({ userId: 1, isActive: 1 });
HabitSchema.index({ teamId: 1 });

export default mongoose.model<IHabit>('Habit', HabitSchema);
```

---

### 3. HabitEntry Model (`backend/src/models/HabitEntry.ts`)

```typescript
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
```

---

### 4. Team Model (`backend/src/models/Team.ts`)

```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  description?: string;
  createdBy: mongoose.Types.ObjectId;
  isActive: boolean;
  settings: {
    allowPublicJoin: boolean;
    requireApproval: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema = new Schema<ITeam>(
  {
    name: {
      type: String,
      required: [true, 'Team name is required'],
      trim: true,
      maxlength: [100, 'Team name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator ID is required'],
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    settings: {
      allowPublicJoin: {
        type: Boolean,
        default: false,
      },
      requireApproval: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
TeamSchema.index({ createdBy: 1 });
TeamSchema.index({ isActive: 1 });

export default mongoose.model<ITeam>('Team', TeamSchema);
```

---

### 5. TeamMember Model (`backend/src/models/TeamMember.ts`)

```typescript
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
```

---

### 6. Notification Model (`backend/src/models/Notification.ts`)

```typescript
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
```

---

### 7. UserStats Model (`backend/src/models/UserStats.ts`)

```typescript
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
```

---

## Database Connection (`backend/src/config/database.ts`)

```typescript
import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/habittracker';
    
    const conn = await mongoose.connect(mongoURI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
```

---

## Example Controller (`backend/src/controllers/habits.controller.ts`)

```typescript
import { Request, Response } from 'express';
import Habit from '../models/Habit';
import HabitEntry from '../models/HabitEntry';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

// Get all habits for authenticated user
export const getHabits = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const habits = await Habit.find({ userId, isActive: true })
      .populate('teamId', 'name')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: habits });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create a new habit
export const createHabit = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { title, description, frequency, teamId, color } = req.body;
    
    const habit = await Habit.create({
      userId,
      title,
      description,
      frequency: frequency || 'daily',
      teamId: teamId || undefined,
      color,
    });
    
    res.status(201).json({ success: true, data: habit });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Mark habit as completed
export const completeHabit = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { habitId } = req.params;
    const { notes } = req.body;
    
    // Verify habit belongs to user
    const habit = await Habit.findOne({ _id: habitId, userId });
    if (!habit) {
      return res.status(404).json({ success: false, error: 'Habit not found' });
    }
    
    // Create entry for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const entry = await HabitEntry.create({
      habitId,
      userId,
      completedAt: today,
      notes,
    });
    
    // TODO: Update user stats and check for streaks
    // This would be handled by a service
    
    res.json({ success: true, data: entry });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};
```

---

## Example Route (`backend/src/routes/habits.routes.ts`)

```typescript
import express from 'express';
import { getHabits, createHabit, completeHabit } from '../controllers/habits.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getHabits);
router.post('/', createHabit);
router.post('/:habitId/complete', completeHabit);

export default router;
```

---

## Example Auth Middleware (`backend/src/middleware/auth.middleware.ts`)

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({ success: false, error: 'No token provided' });
      return;
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
    };
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
};
```

---

These examples provide a solid foundation for the MongoDB migration. Each model includes proper validation, indexes, and relationships.

