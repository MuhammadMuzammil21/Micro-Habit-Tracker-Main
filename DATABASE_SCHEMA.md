# 🧩 **HabitLink Database Schema (MongoDB / Mongoose)**

> **Updated to match actual API implementation and data requirements**

---

## 🧍‍♂️ 1. **User Schema**

Stores user credentials, profile info, and authentication tokens.

```typescript
// models/User.ts

import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string; // Hashed with bcrypt
  name?: string;
  avatarUrl?: string;
  emailVerified: boolean;
  verificationToken?: string;
  refreshToken?: string; // Single JWT refresh token
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

**Key Points:**
- Password is hashed automatically before save
- `refreshToken` is a single string (not array)
- Team memberships are managed via `TeamMember` model (not embedded)
- Email is unique and indexed

---

## 👥 2. **Team Schema**

Defines teams with settings and metadata. Members are tracked separately in `TeamMember`.

```typescript
// models/Team.ts

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

**Key Points:**
- Members are stored in separate `TeamMember` collection
- `isActive` flag for soft deletion
- `settings` object for team configuration
- No embedded members array

---

## 👥 3. **TeamMember Schema**

Junction table for User-Team relationships with roles and status.

```typescript
// models/TeamMember.ts

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

**Key Points:**
- Prevents duplicate memberships with unique compound index
- `status` tracks membership state (active, pending, left)
- `role` distinguishes admins from members
- Used to query team members and verify permissions

---

## ✅ 4. **Habit Schema**

Stores habit definitions — can belong to a team or be personal.

```typescript
// models/Habit.ts

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

**Key Points:**
- `teamId` is optional (null for personal habits)
- `isActive` flag for soft deletion (not `isArchived`)
- `color` field for UI customization
- No `participants` array - all team members can complete team habits
- No `reminderTime` - handled separately if needed

---

## 🗓️ 5. **HabitEntry Schema**

Tracks completion records per user per habit with timestamps.

```typescript
// models/HabitEntry.ts

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

**Key Points:**
- Uses `completedAt` (Date) instead of separate `date` and `completed` fields
- `notes` field for optional user notes
- No `streakCount` - streaks are calculated dynamically from entries
- Indexed for efficient queries by habit, user, and date

---

## 📊 6. **UserStats Schema**

Cached statistics for quick access without aggregation.

```typescript
// models/UserStats.ts

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

**Key Points:**
- One stats document per user (unique constraint)
- Cached values updated periodically or on completion
- Used for quick dashboard/analytics display
- Can be recalculated from `HabitEntry` if needed

---

## 🔔 7. **Notification Schema**

Stores in-app notifications for users.

```typescript
// models/Notification.ts

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

**Key Points:**
- `read` boolean for read/unread status
- `metadata` object for flexible related data
- Auto-deletes after 90 days (TTL index)
- Types: achievement, team, habit, milestone

---

## ⚙️ Relationships Overview

| Relationship              | Type         | Implementation                    | Description                                    |
| ------------------------- | ------------ | --------------------------------- | ---------------------------------------------- |
| **User → Team**           | Many-to-Many | Via `TeamMember` collection       | Users can belong to multiple teams             |
| **Team → User**           | Many-to-Many | Via `TeamMember` collection       | Teams can have many members                    |
| **Team → Habit**          | One-to-Many  | `Habit.teamId` → `Team._id`       | Teams can have many habits                     |
| **User → Habit**          | One-to-Many  | `Habit.userId` → `User._id`       | Users can create many habits                   |
| **Habit → HabitEntry**    | One-to-Many  | `HabitEntry.habitId` → `Habit._id` | Each habit has many completion entries         |
| **User → HabitEntry**     | One-to-Many  | `HabitEntry.userId` → `User._id`  | Each user has many completion records          |
| **User → UserStats**      | One-to-One   | `UserStats.userId` → `User._id`   | One stats document per user                    |
| **User → Notification**    | One-to-Many  | `Notification.userId` → `User._id` | Each user has many notifications               |
| **Team → TeamMember**     | One-to-Many  | `TeamMember.teamId` → `Team._id`   | Each team has many member records              |
| **User → TeamMember**     | One-to-Many  | `TeamMember.userId` → `User._id`   | Each user can be in many teams                 |

---

## 🧠 Indexing Strategy

Optimized indexes for common query patterns:

```typescript
// User
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ refreshToken: 1 });

// Team
TeamSchema.index({ createdBy: 1 });
TeamSchema.index({ isActive: 1 });

// TeamMember
TeamMemberSchema.index({ teamId: 1, userId: 1 }, { unique: true });

// Habit
HabitSchema.index({ userId: 1, isActive: 1 });
HabitSchema.index({ teamId: 1 }); // Sparse index

// HabitEntry
HabitEntrySchema.index({ habitId: 1, completedAt: -1 });
HabitEntrySchema.index({ userId: 1, completedAt: -1 });

// UserStats
UserStatsSchema.index({ userId: 1 }, { unique: true });

// Notification
NotificationSchema.index({ userId: 1, read: 1 });
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // TTL
```

---

## 📝 API Data Flow Examples

### Creating a Habit
```typescript
// POST /api/habits
{
  title: "Morning Meditation",
  description: "10 minutes daily",
  frequency: "daily",
  teamId: "optional-team-id",
  color: "#FF5733"
}

// Stored in Habit collection
{
  _id: ObjectId,
  userId: ObjectId("user-id"),
  title: "Morning Meditation",
  description: "10 minutes daily",
  frequency: "daily",
  isActive: true,
  teamId: ObjectId("team-id") || null,
  color: "#FF5733",
  createdAt: Date,
  updatedAt: Date
}
```

### Completing a Habit
```typescript
// POST /api/habits/:habitId/complete
// Creates HabitEntry
{
  _id: ObjectId,
  habitId: ObjectId("habit-id"),
  userId: ObjectId("user-id"),
  completedAt: Date,
  notes: "Optional note",
  createdAt: Date
}
```

### Getting Team Members
```typescript
// GET /api/teams/:id
// Queries TeamMember collection
TeamMember.find({ teamId, status: 'active' })
  .populate('userId', 'name email')
```

### Getting User Stats
```typescript
// GET /api/analytics/stats
// Returns UserStats document
{
  totalHabits: 5,
  activeHabits: 4,
  totalCompletions: 120,
  longestStreak: 30,
  currentStreak: 7,
  completionRate: 85
}
```

---

## 🔐 Data Lifecycle

### User Deletion
- **Soft Delete**: Set `isActive: false` on related teams
- **Cascade**: Remove `TeamMember` records
- **Preserve**: Keep `HabitEntry` for historical data (or anonymize)

### Habit Deletion
- **Soft Delete**: Set `isActive: false`
- **Preserve**: Keep `HabitEntry` records for analytics

### Team Deletion
- **Soft Delete**: Set `isActive: false`
- **Cascade**: Update `TeamMember.status` to 'left'
- **Habits**: Set `Habit.teamId` to null or keep reference

### Notification Cleanup
- **TTL Index**: Auto-deletes after 90 days
- **Manual**: Can delete read notifications older than X days

### HabitEntry Cleanup
- **Optional**: Cron job to archive entries older than 1 year
- **Analytics**: Keep aggregated data in `UserStats`

---

## 🚀 Query Patterns

### Get User's Active Habits
```typescript
Habit.find({ userId, isActive: true })
  .populate('teamId', 'name')
  .sort({ createdAt: -1 });
```

### Get Team Habits
```typescript
Habit.find({ teamId, isActive: true })
  .populate('userId', 'name')
  .sort({ createdAt: -1 });
```

### Get Completion Streak
```typescript
// Calculate from HabitEntry
HabitEntry.find({ 
  habitId, 
  userId,
  completedAt: { $gte: startDate }
})
.sort({ completedAt: -1 });
```

### Get Team Leaderboard
```typescript
// Aggregate completions per user
HabitEntry.aggregate([
  { $match: { 
    habitId: { $in: teamHabitIds },
    completedAt: { $gte: startDate }
  }},
  { $group: {
    _id: "$userId",
    totalCompletions: { $sum: 1 }
  }},
  { $sort: { totalCompletions: -1 }},
  { $limit: 10 }
]);
```

---

## ✅ **Summary**

This schema supports:
- ✅ Personal & team habits
- ✅ Real-time completion tracking
- ✅ Streak calculation (dynamic from entries)
- ✅ Team collaboration with roles
- ✅ Cached user statistics
- ✅ In-app notifications
- ✅ Efficient queries with proper indexing
- ✅ Soft deletion for data preservation
- ✅ Auto-cleanup of old notifications

**Key Differences from Original:**
- Uses `TeamMember` junction table instead of embedded arrays
- `HabitEntry` uses `completedAt` Date instead of separate date/boolean
- `UserStats` for cached analytics
- `Notification` with TTL auto-cleanup
- `isActive` flags for soft deletion
- No embedded arrays in main schemas

