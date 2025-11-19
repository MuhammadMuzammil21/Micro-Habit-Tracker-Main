# MERN Stack Migration Plan
## Micro-Habit Tracker: Supabase → MERN Stack

---

## 📋 Executive Summary

This document outlines the complete migration plan to move the Micro-Habit Tracker application from **Supabase (PostgreSQL + Auth + Edge Functions)** to a **MERN Stack (MongoDB, Express.js, React, Node.js)**.

### Current Stack
- **Frontend**: React + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth

### Target Stack
- **Frontend**: React + TypeScript + Vite (unchanged)
- **Backend**: Express.js + Node.js + TypeScript
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (jsonwebtoken) + bcrypt

---

## 🗄️ Database Schema Migration

### MongoDB Collections Design

#### 1. **Users Collection**
```javascript
{
  _id: ObjectId,
  email: String (unique, required, indexed),
  password: String (hashed, required),
  name: String,
  avatarUrl: String,
  createdAt: Date,
  updatedAt: Date,
  refreshToken: String (optional, for JWT refresh),
  emailVerified: Boolean (default: false),
  verificationToken: String (optional)
}
```

**Indexes:**
- `email`: unique index
- `refreshToken`: index (for token lookup)

---

#### 2. **Habits Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required, indexed),
  title: String (required),
  description: String,
  frequency: String (enum: ['daily', 'weekly'], required),
  createdAt: Date,
  updatedAt: Date,
  isActive: Boolean (default: true),
  teamId: ObjectId (ref: 'Team', optional),
  color: String (optional, for UI customization)
}
```

**Indexes:**
- `userId`: index
- `teamId`: index (sparse)
- `userId + isActive`: compound index

---

#### 3. **HabitEntries Collection** (Completions/Logs)
```javascript
{
  _id: ObjectId,
  habitId: ObjectId (ref: 'Habit', required, indexed),
  userId: ObjectId (ref: 'User', required, indexed),
  completedAt: Date (required, indexed),
  notes: String (optional),
  createdAt: Date
}
```

**Indexes:**
- `habitId`: index
- `userId`: index
- `completedAt`: index
- `habitId + completedAt`: compound index (for streak calculation)
- `userId + completedAt`: compound index (for user stats)

---

#### 4. **Teams Collection**
```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String,
  createdBy: ObjectId (ref: 'User', required),
  createdAt: Date,
  updatedAt: Date,
  isActive: Boolean (default: true),
  settings: {
    allowPublicJoin: Boolean (default: false),
    requireApproval: Boolean (default: true)
  }
}
```

**Indexes:**
- `createdBy`: index
- `isActive`: index

---

#### 5. **TeamMembers Collection**
```javascript
{
  _id: ObjectId,
  teamId: ObjectId (ref: 'Team', required, indexed),
  userId: ObjectId (ref: 'User', required, indexed),
  role: String (enum: ['admin', 'member'], default: 'member'),
  joinedAt: Date,
  status: String (enum: ['active', 'pending', 'left'], default: 'pending')
}
```

**Indexes:**
- `teamId + userId`: unique compound index
- `userId`: index
- `teamId`: index

---

#### 6. **Notifications Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required, indexed),
  type: String (enum: ['achievement', 'team', 'habit', 'milestone'], required),
  title: String (required),
  message: String (required),
  read: Boolean (default: false),
  createdAt: Date (indexed),
  metadata: {
    habitId: ObjectId (optional),
    teamId: ObjectId (optional),
    streakCount: Number (optional)
  }
}
```

**Indexes:**
- `userId + read`: compound index
- `userId + createdAt`: compound index (for sorting)
- `createdAt`: TTL index (auto-delete after 90 days)

---

#### 7. **UserStats Collection** (Denormalized for performance)
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', unique, required),
  totalHabits: Number (default: 0),
  activeHabits: Number (default: 0),
  totalCompletions: Number (default: 0),
  longestStreak: Number (default: 0),
  currentStreak: Number (default: 0),
  completionRate: Number (default: 0), // percentage
  lastUpdated: Date
}
```

**Indexes:**
- `userId`: unique index

---

## 🏗️ Backend Architecture (Express.js)

### Project Structure
```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # MongoDB connection
│   │   ├── env.ts               # Environment variables
│   │   └── cors.ts              # CORS configuration
│   ├── models/
│   │   ├── User.ts
│   │   ├── Habit.ts
│   │   ├── HabitEntry.ts
│   │   ├── Team.ts
│   │   ├── TeamMember.ts
│   │   ├── Notification.ts
│   │   └── UserStats.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── habits.routes.ts
│   │   ├── teams.routes.ts
│   │   ├── analytics.routes.ts
│   │   ├── notifications.routes.ts
│   │   └── contact.routes.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── habits.controller.ts
│   │   ├── teams.controller.ts
│   │   ├── analytics.controller.ts
│   │   ├── notifications.controller.ts
│   │   └── contact.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts   # JWT verification
│   │   ├── error.middleware.ts  # Error handling
│   │   └── validate.middleware.ts # Request validation
│   ├── services/
│   │   ├── email.service.ts     # Replace Resend Edge Function
│   │   ├── stats.service.ts     # Calculate streaks, completion rates
│   │   └── notification.service.ts
│   ├── utils/
│   │   ├── jwt.util.ts
│   │   ├── bcrypt.util.ts
│   │   └── logger.util.ts
│   └── app.ts                   # Express app setup
├── package.json
├── tsconfig.json
└── .env.example
```

---

## 📦 Dependencies to Install

### Backend (`backend/package.json`)
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-validator": "^7.0.1",
    "nodemailer": "^6.9.7",
    "zod": "^3.22.4",
    "compression": "^1.7.4"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.0",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/bcryptjs": "^2.4.6",
    "@types/cors": "^2.8.17",
    "@types/nodemailer": "^6.4.14",
    "typescript": "^5.3.3",
    "ts-node": "^10.9.2",
    "ts-node-dev": "^2.0.0",
    "nodemon": "^3.0.2"
  }
}
```

---

## 🔄 Migration Steps

### Phase 1: Backend Setup (Week 1)

#### Step 1.1: Initialize Backend Project
- [ ] Create `backend/` directory
- [ ] Initialize npm project
- [ ] Install dependencies
- [ ] Set up TypeScript configuration
- [ ] Create folder structure

#### Step 1.2: Database Connection
- [ ] Set up MongoDB connection (Mongoose)
- [ ] Create environment variables file
- [ ] Test database connectivity
- [ ] Set up connection pooling

#### Step 1.3: Create Mongoose Models
- [ ] User model with schema validation
- [ ] Habit model
- [ ] HabitEntry model
- [ ] Team model
- [ ] TeamMember model
- [ ] Notification model
- [ ] UserStats model
- [ ] Create all indexes

#### Step 1.4: Authentication System
- [ ] Implement JWT token generation
- [ ] Implement password hashing (bcrypt)
- [ ] Create auth middleware
- [ ] Create signup endpoint
- [ ] Create login endpoint
- [ ] Create refresh token endpoint
- [ ] Create logout endpoint

---

### Phase 2: API Development (Week 2)

#### Step 2.1: Habits API
- [ ] `GET /api/habits` - Get user's habits
- [ ] `POST /api/habits` - Create habit
- [ ] `GET /api/habits/:id` - Get single habit
- [ ] `PUT /api/habits/:id` - Update habit
- [ ] `DELETE /api/habits/:id` - Delete habit
- [ ] `POST /api/habits/:id/complete` - Mark habit as completed

#### Step 2.2: Teams API
- [ ] `GET /api/teams` - Get user's teams
- [ ] `POST /api/teams` - Create team
- [ ] `GET /api/teams/:id` - Get team details
- [ ] `POST /api/teams/:id/members` - Invite member
- [ ] `DELETE /api/teams/:id/members/:userId` - Remove member

#### Step 2.3: Analytics API
- [ ] `GET /api/analytics/stats` - Get user statistics
- [ ] `GET /api/analytics/trends` - Get completion trends
- [ ] `GET /api/analytics/team-leaderboard` - Get team leaderboard

#### Step 2.4: Notifications API
- [ ] `GET /api/notifications` - Get user notifications
- [ ] `PUT /api/notifications/:id/read` - Mark as read
- [ ] `DELETE /api/notifications/:id` - Delete notification

#### Step 2.5: Contact API
- [ ] `POST /api/contact` - Send contact email (replace Edge Function)

---

### Phase 3: Frontend Migration (Week 3)

#### Step 3.1: Create API Client
- [ ] Create `src/lib/api.ts` - Axios/fetch wrapper
- [ ] Set up interceptors for JWT tokens
- [ ] Handle token refresh
- [ ] Create API service functions

#### Step 3.2: Replace Supabase Auth
- [ ] Update `src/pages/Auth.tsx` to use new API
- [ ] Update `src/components/ProtectedRoute.tsx` to use JWT
- [ ] Create auth context/hook
- [ ] Update `src/components/Navbar.tsx` logout

#### Step 3.3: Replace Supabase Queries
- [ ] Update `src/pages/Dashboard.tsx` to fetch from API
- [ ] Update `src/components/HabitCard.tsx` to use API
- [ ] Update `src/components/HabitDialog.tsx` to use API
- [ ] Update `src/pages/Analytics.tsx` to fetch from API
- [ ] Update `src/pages/Teams.tsx` to use API
- [ ] Update `src/pages/Contact.tsx` to use API

#### Step 3.4: Update Environment Variables
- [ ] Create `.env` file with `VITE_API_URL`
- [ ] Remove Supabase environment variables
- [ ] Update `vite.config.ts` if needed

---

### Phase 4: Data Migration (Week 4)

#### Step 4.1: Export Supabase Data
- [ ] Export users from Supabase
- [ ] Export profiles from Supabase
- [ ] Export any existing habits (if any)

#### Step 4.2: Data Transformation Script
- [ ] Create Node.js script to transform data
- [ ] Map Supabase users to MongoDB users
- [ ] Hash passwords (if migrating existing users)
- [ ] Transform timestamps

#### Step 4.3: Import to MongoDB
- [ ] Run import script
- [ ] Verify data integrity
- [ ] Check indexes are created

---

### Phase 5: Testing & Cleanup (Week 5)

#### Step 5.1: Testing
- [ ] Test all authentication flows
- [ ] Test CRUD operations for habits
- [ ] Test team functionality
- [ ] Test analytics endpoints
- [ ] Test notification system
- [ ] Test contact form

#### Step 5.2: Remove Supabase Dependencies
- [ ] Remove `@supabase/supabase-js` from package.json
- [ ] Delete `src/integrations/supabase/` directory
- [ ] Delete `supabase/` directory
- [ ] Remove Supabase types

#### Step 5.3: Documentation
- [ ] Update README.md
- [ ] Document API endpoints
- [ ] Document environment variables
- [ ] Create deployment guide

---

## 🔐 Authentication Flow

### JWT Implementation

**Access Token:**
- Short-lived (15 minutes)
- Stored in memory (React state)
- Sent in `Authorization: Bearer <token>` header

**Refresh Token:**
- Long-lived (7 days)
- Stored in HTTP-only cookie or localStorage
- Used to get new access token

**Flow:**
1. User signs up/logs in → Server returns access + refresh tokens
2. Frontend stores access token in memory, refresh token in storage
3. Each API request includes access token in header
4. If access token expires → Frontend uses refresh token to get new access token
5. If refresh token expires → User must log in again

---

## 📧 Email Service Migration

### Replace Supabase Edge Function

**Current:** `supabase/functions/send-contact-email/index.ts`

**New:** Express route `POST /api/contact`

**Implementation Options:**
1. **Nodemailer** (recommended for simplicity)
2. **Resend API** (if already using Resend)
3. **SendGrid**
4. **AWS SES**

---

## 🚀 Deployment Considerations

### Environment Variables

**Backend (.env):**
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/habittracker
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:8080
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:5000/api
```

---

## ⚠️ Breaking Changes & Considerations

### 1. Real-time Features
- **Current:** Supabase real-time subscriptions
- **New:** WebSockets (Socket.io) or polling
- **Impact:** Team feed updates will need WebSocket implementation

### 2. File Storage
- **Current:** Supabase Storage (if used for avatars)
- **New:** MongoDB GridFS or cloud storage (AWS S3, Cloudinary)
- **Impact:** Avatar uploads need new implementation

### 3. Row Level Security (RLS)
- **Current:** Automatic RLS in Supabase
- **New:** Manual authorization checks in middleware
- **Impact:** Must implement authorization in every protected route

### 4. Database Triggers
- **Current:** PostgreSQL triggers for `updated_at`, profile creation
- **New:** Mongoose middleware (pre/post hooks)
- **Impact:** Must implement hooks in models

---

## 📊 Performance Optimizations

### 1. Aggregation Pipelines
- Use MongoDB aggregation for complex analytics queries
- Pre-calculate streaks and stats (UserStats collection)

### 2. Caching
- Consider Redis for frequently accessed data
- Cache user stats, team leaderboards

### 3. Indexing Strategy
- All foreign keys indexed
- Compound indexes for common query patterns
- TTL indexes for temporary data

---

## 🧪 Testing Strategy

### Backend Tests
- Unit tests for controllers
- Integration tests for API endpoints
- Database tests with test MongoDB instance

### Frontend Tests
- Update existing tests to use new API
- Mock API responses in tests
- Test authentication flows

---

## 📅 Timeline Estimate

- **Week 1:** Backend setup and models
- **Week 2:** API development
- **Week 3:** Frontend migration
- **Week 4:** Data migration
- **Week 5:** Testing and cleanup

**Total: 5 weeks**

---

## ✅ Success Criteria

- [ ] All Supabase dependencies removed
- [ ] All features working with MongoDB backend
- [ ] Authentication working with JWT
- [ ] All API endpoints tested
- [ ] Frontend fully migrated
- [ ] Data successfully migrated
- [ ] Documentation updated
- [ ] Deployment ready

---

## 📝 Next Steps

1. Review and approve this migration plan
2. Set up MongoDB instance (local or cloud)
3. Initialize backend project structure
4. Begin Phase 1 implementation

---

**Last Updated:** 2025-01-XX
**Version:** 1.0

