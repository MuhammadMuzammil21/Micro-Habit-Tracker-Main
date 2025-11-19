# Habit Tracker Backend

MERN Stack backend for Micro-Habit Tracker application.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB installed locally or MongoDB Atlas account

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/habittracker
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
FRONTEND_URL=http://localhost:8080
```

4. Start development server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── models/          # Mongoose models
│   ├── routes/          # Express routes
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── services/        # Business logic services
│   ├── utils/           # Utility functions
│   └── app.ts           # Express app setup
├── .env                 # Environment variables
├── package.json
└── tsconfig.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `POST /api/auth/signout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Habits
- `GET /api/habits` - Get all user habits
- `GET /api/habits/:id` - Get single habit
- `POST /api/habits` - Create habit
- `PUT /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Delete habit
- `POST /api/habits/:habitId/complete` - Mark habit as completed

## 🔐 Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## 📝 Environment Variables

See `.env.example` for all required environment variables.

## 🛠️ Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run start:dev` - Start with nodemon

## 🧪 Testing

Health check endpoint:
```bash
curl http://localhost:5000/health
```

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **cors** - CORS middleware
- **helmet** - Security middleware
- **dotenv** - Environment variables

## 🚧 TODO

- [ ] Implement teams API
- [ ] Implement analytics API
- [ ] Implement notifications API
- [ ] Implement contact email service
- [ ] Add stats calculation service
- [ ] Add streak calculation
- [ ] Add unit tests
- [ ] Add integration tests

