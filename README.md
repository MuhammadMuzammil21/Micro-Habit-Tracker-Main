# 🎯 HabitLink - Team-Based Micro-Habit Tracker

A full-stack MERN application that helps small teams build better habits together through collaborative accountability, real-time updates, and gamification.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?style=flat&logo=javascript)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat&logo=socket.io)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Real-Time Features](#-realtime-features)
- [Database Schema](#-database-schema)
- [Email Configuration](#-email-configuration)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

## ✨ Features

### 👤 User Management
- **Authentication**: JWT-based auth with access & refresh tokens
- **User Profiles**: Name, avatar, email, team associations
- **Role-Based Access**: Admin and Member roles for team management

### ✅ Habit Tracking
- **Create Habits**: Personal or team habits with custom frequency (daily/weekly)
- **Track Progress**: One-click completion tracking
- **Reminder System**: Email reminders at custom times
- **Streak Tracking**: Automatic streak calculation and visualization
- **Habit History**: View completion calendar and analytics

### 👥 Team Collaboration
- **Create Teams**: Form teams with custom names and descriptions
- **Team Habits**: Shared habits visible to all team members
- **Real-Time Feed**: Live updates when team members complete habits
- **Team Leaderboards**: Rank members by streaks and completions
- **Invite System**: Generate invite links or send email invitations
- **Team Management**: Edit, delete, and leave teams

### 📊 Analytics Dashboard
- **Personal Stats**: Completion rates, longest streaks, total completions
- **Team Analytics**: Team-wide statistics and leaderboards
- **Visual Charts**: Weekly progress, habit breakdown, monthly trends
- **Real-Time Updates**: Live leaderboard updates via WebSocket

### 🔔 Notifications
- **In-App Notifications**: Achievement, team, habit, and milestone notifications
- **Email Reminders**: Automated daily habit reminders
- **Unread Count**: Badge showing unread notifications
- **Mark as Read**: Individual and bulk read status management

### 🔄 Real-Time Updates
- **Socket.io Integration**: WebSocket-based real-time communication
- **Live Feed**: Instant updates when habits are completed
- **Team Rooms**: Automatic room joining for team updates
- **Leaderboard Sync**: Real-time leaderboard updates

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Shadcn/ui** - Component library
- **React Query** - Data fetching and caching
- **React Router** - Navigation
- **Socket.io Client** - Real-time communication
- **Recharts** - Data visualization
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Socket.io** - WebSocket server
- **Nodemailer** - Email service
- **Node-cron** - Scheduled tasks
- **Bcrypt** - Password hashing

## 📁 Project Structure

```
Micro-Habit-Tracker-main/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── config/         # Database, Socket.io config
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Auth, error handling
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── services/        # Email service
│   │   ├── jobs/            # Cron jobs
│   │   ├── utils/           # JWT utilities
│   │   └── app.ts           # Express app
│   ├── dist/                # Compiled JavaScript
│   └── package.json
│
├── src/                     # Frontend React app
│   ├── components/          # Reusable components
│   ├── pages/               # Page components
│   ├── contexts/            # React contexts (Auth)
│   ├── lib/                 # Utilities (API, Socket)
│   ├── services/            # API services
│   └── hooks/               # Custom hooks
│
├── public/                  # Static assets
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local or Atlas)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Micro-Habit-Tracker-main
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ..
   npm install
   ```

4. **Set up environment variables** (see [Environment Variables](#-environment-variables))

5. **Start MongoDB** (if using local instance)
   ```bash
   mongod
   ```

## 🔐 Environment Variables

### Backend (`.env` in `backend/`)

```env
# Database
MONGODB_URI=mongodb://localhost:27017/habitlink
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/habitlink

# JWT Secrets
JWT_ACCESS_SECRET=your-access-token-secret-here
JWT_REFRESH_SECRET=your-refresh-token-secret-here

# Server
PORT=5000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:5173

# Email (Optional - see EMAIL_SETUP.md)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Frontend (`.env` in root - Optional)

```env
VITE_API_URL=http://localhost:5000
```

**Note**: If not set, defaults to `http://localhost:5000`

## ▶️ Running the Application

### Development Mode

1. **Start Backend**
   ```bash
   cd backend
   npm run dev
   ```
   Backend runs on: http://localhost:5000

2. **Start Frontend** (in a new terminal)
   ```bash
   npm run dev
   ```
   Frontend runs on: http://localhost:5173

3. **Open Browser**
   - Navigate to: http://localhost:5173
   - Create an account or sign in

### Production Build

1. **Build Backend**
   ```bash
   cd backend
   npm run build
   npm start
   ```

2. **Build Frontend**
   ```bash
   npm run build
   npm run preview
   ```

## 📡 API Documentation

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/signin` | Login user | No |
| POST | `/api/auth/refresh` | Refresh access token | No |
| POST | `/api/auth/signout` | Sign out user | Yes |
| GET | `/api/auth/me` | Get current user | Yes |

### Habits

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/habits` | Get user's habits | Yes |
| POST | `/api/habits` | Create new habit | Yes |
| PUT | `/api/habits/:id` | Update habit | Yes |
| DELETE | `/api/habits/:id` | Delete habit | Yes |
| POST | `/api/habits/:id/complete` | Mark habit as complete | Yes |

### Teams

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/teams` | Get user's teams | Yes |
| GET | `/api/teams/:id` | Get team details | Yes |
| POST | `/api/teams` | Create team | Yes |
| PUT | `/api/teams/:id` | Update team | Yes (Admin) |
| DELETE | `/api/teams/:id` | Delete team | Yes (Admin) |
| POST | `/api/teams/:id/join` | Join team | Yes |
| POST | `/api/teams/:id/leave` | Leave team | Yes |
| POST | `/api/teams/:id/invite` | Generate invite link | Yes (Admin) |
| POST | `/api/teams/invite/:code` | Join via invite code | Yes |

### Analytics

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/analytics/stats` | Get user stats | Yes |
| GET | `/api/analytics/weekly` | Get weekly progress | Yes |
| GET | `/api/analytics/habits` | Get habit breakdown | Yes |
| GET | `/api/analytics/monthly` | Get monthly trend | Yes |
| GET | `/api/analytics/team/:id/leaderboard` | Get team leaderboard | Yes |
| GET | `/api/analytics/feed` | Get team feed | Yes |

### Notifications

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/notifications` | Get notifications | Yes |
| GET | `/api/notifications/unread-count` | Get unread count | Yes |
| PUT | `/api/notifications/:id/read` | Mark as read | Yes |
| PUT | `/api/notifications/read-all` | Mark all as read | Yes |
| DELETE | `/api/notifications/:id` | Delete notification | Yes |

### Contact

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/contact` | Send contact message | No |

## 🔄 Real-Time Features

### Socket.io Events

#### Client → Server

- `join_team` - Join a team room for real-time updates
  ```javascript
  socket.emit('join_team', teamId);
  ```

- `leave_team` - Leave a team room
  ```javascript
  socket.emit('leave_team', teamId);
  ```

#### Server → Client

- `habit_completed` - Emitted to user's personal room
  ```javascript
  {
    habitId: string,
    habitTitle: string,
    userId: string,
    userName: string,
    completedAt: Date
  }
  ```

- `update_feed` - Emitted to team room on habit completion
  ```javascript
  {
    id: string,
    userName: string,
    habitTitle: string,
    timestamp: string,
    habitId: string,
    userId: string
  }
  ```

- `team_leaderboard_update` - Emitted when team stats change
  ```javascript
  {
    teamId: string
  }
  ```

### Frontend Integration

The frontend automatically:
- Connects to Socket.io on login
- Joins team rooms when viewing team details
- Updates UI in real-time when events are received
- Disconnects on logout

## 🗄 Database Schema

### Models

- **User**: Authentication, profile, team memberships
- **Team**: Team information, settings, invite links
- **TeamMember**: Junction table for user-team relationships
- **Habit**: Habit definitions (personal or team)
- **HabitEntry**: Daily/weekly completion records
- **Notification**: In-app notifications
- **UserStats**: Cached user statistics

See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for detailed schema documentation.

## 📧 Email Configuration

The application supports email reminders and team invitations via Nodemailer.

### Setup

1. **Gmail** (Recommended for development)
   - Enable 2-Factor Authentication
   - Generate App Password: https://myaccount.google.com/apppasswords
   - Use App Password in `SMTP_PASS`

2. **Other Providers**
   - See [backend/EMAIL_SETUP.md](./backend/EMAIL_SETUP.md) for detailed instructions

### Features

- **Habit Reminders**: Automated emails at custom reminder times
- **Team Invitations**: Email invites when generating team invite links
- **Graceful Degradation**: App works without email configuration

## 🚢 Deployment

### Backend Deployment

1. **Build the project**
   ```bash
   cd backend
   npm run build
   ```

2. **Set environment variables** on your hosting platform

3. **Start the server**
   ```bash
   npm start
   ```

**Recommended Platforms:**
- **Render** - Easy Node.js deployment
- **Railway** - Simple setup with MongoDB
- **Heroku** - Traditional PaaS
- **AWS EC2** - Full control

### Frontend Deployment

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Deploy `dist/` folder** to:
   - **Vercel** (Recommended)
   - **Netlify**
   - **AWS S3 + CloudFront**
   - **GitHub Pages**

3. **Update `VITE_API_URL`** to your backend URL

### MongoDB

- **MongoDB Atlas** (Recommended for production)
- **Self-hosted** MongoDB instance

## 🐛 Troubleshooting

### Frontend shows Postgres page
- **Issue**: Port 8080 is in use
- **Solution**: Frontend now uses port 5173 by default

### Socket.io connection errors
- Check backend is running on port 5000
- Verify CORS settings allow frontend origin
- Check browser console for specific errors

### Email not sending
- Verify SMTP credentials in `.env`
- For Gmail, use App Password (not regular password)
- Check console logs for error messages
- App continues to work without email

### Database connection errors
- Verify MongoDB is running (if local)
- Check `MONGODB_URI` in `.env`
- Ensure network access (for Atlas)

### Build errors
- Run `npm install` in both root and `backend/`
- Clear `node_modules` and reinstall if needed
- Check TypeScript version compatibility

## 📚 Additional Documentation

- [Database Schema](./DATABASE_SCHEMA.md) - Complete schema documentation
- [Email Setup](./backend/EMAIL_SETUP.md) - Email configuration guide
- [Frontend Setup](./FRONTEND_SETUP.md) - Frontend-specific instructions
- [PRD Compliance](./PRD_COMPLIANCE_REPORT.md) - Feature compliance report
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md) - Implementation details

## 🎯 Key Features Summary

✅ **Real-Time Collaboration** - Socket.io WebSocket integration  
✅ **Email Automation** - Scheduled reminders and invitations  
✅ **Team Management** - Invite links, roles, and permissions  
✅ **Analytics Dashboard** - Comprehensive stats and visualizations  
✅ **JWT Authentication** - Secure token-based auth  
✅ **Responsive Design** - Mobile-friendly UI  
✅ **Type Safety** - Full TypeScript implementation  

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Muhammad Muzammil**

---

For questions or support, please open an issue on GitHub.
