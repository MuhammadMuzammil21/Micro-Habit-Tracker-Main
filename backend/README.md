# Backend API

Express.js backend for Micro-Habit Tracker.

## Quick Start

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and configure
3. Start server: `npm run dev`

See the main [README.md](../README.md) for complete setup instructions and documentation.

## Project Structure

```
backend/
├── src/
│   ├── config/         # Database configuration
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Auth & error middleware
│   └── utils/          # JWT utilities
├── .env                # Environment variables
└── package.json
```

## Environment Variables

Required environment variables (see `.env.example`):
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_REFRESH_SECRET` - JWT refresh secret
- `PORT` - Server port (default: 5000)
- `FRONTEND_URL` - Frontend URL for CORS

## API Endpoints

See main README.md for complete API documentation.
