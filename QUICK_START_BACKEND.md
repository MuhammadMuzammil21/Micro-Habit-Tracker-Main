# Quick Start Guide - Backend Setup

## Prerequisites

- Node.js 18+ installed
- MongoDB installed locally or MongoDB Atlas account
- npm or yarn

---

## Step 1: Initialize Backend Project

```bash
# Create backend directory
mkdir backend
cd backend

# Initialize npm project
npm init -y

# Install dependencies
npm install express mongoose jsonwebtoken bcryptjs dotenv cors helmet express-validator nodemailer zod compression

# Install dev dependencies
npm install -D @types/express @types/node @types/jsonwebtoken @types/bcryptjs @types/cors @types/nodemailer typescript ts-node ts-node-dev nodemon
```

---

## Step 2: TypeScript Configuration

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "types": ["node"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## Step 3: Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── env.ts
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
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validate.middleware.ts
│   ├── services/
│   │   ├── email.service.ts
│   │   ├── stats.service.ts
│   │   └── notification.service.ts
│   ├── utils/
│   │   ├── jwt.util.ts
│   │   ├── bcrypt.util.ts
│   │   └── logger.util.ts
│   └── app.ts
├── .env
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
```

---

## Step 4: Environment Variables

Create `.env` file:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/habittracker
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/habittracker?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-too
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Email (for contact form)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@habitlink.com

# Frontend
FRONTEND_URL=http://localhost:8080
```

Create `.env.example` (without sensitive values):

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/habittracker
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@habitlink.com
FRONTEND_URL=http://localhost:8080
```

---

## Step 5: Basic App Setup

Create `src/app.ts`:

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import connectDB from './config/database';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.routes';
import habitsRoutes from './routes/habits.routes';
// ... other routes

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitsRoutes);
// ... other routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware (create this)
// app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## Step 6: Package.json Scripts

Update `package.json` scripts:

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js",
    "start:dev": "nodemon dist/app.js"
  }
}
```

---

## Step 7: .gitignore

Create `.gitignore`:

```
node_modules/
dist/
.env
*.log
.DS_Store
coverage/
.nyc_output/
```

---

## Step 8: Run the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Or build and run
npm run build
npm start
```

---

## Step 9: Test the Connection

```bash
# Test health endpoint
curl http://localhost:5000/health

# Should return:
# {"status":"ok","timestamp":"2025-01-XX..."}
```

---

## Next Steps

1. Implement authentication routes (signup, login, refresh)
2. Create all Mongoose models (see `backend-schemas-example.md`)
3. Implement API endpoints
4. Add error handling middleware
5. Add request validation
6. Test all endpoints

---

## Common Issues

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` (local) or check Atlas connection string
- Check firewall settings for cloud MongoDB

### Port Already in Use
- Change PORT in `.env` or kill the process using port 5000

### TypeScript Errors
- Ensure all type definitions are installed
- Check `tsconfig.json` paths

---

## Development Tips

1. Use `ts-node-dev` for hot reloading during development
2. Use Postman or Insomnia to test API endpoints
3. Enable MongoDB logging to debug queries
4. Use environment-specific `.env` files (`.env.development`, `.env.production`)

