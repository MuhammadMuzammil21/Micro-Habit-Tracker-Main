# Setup Instructions - MERN Migration

## 🚀 Quick Setup Guide

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file:**
```bash
cp .env.example .env
```

4. **Update `.env` with your configuration:**
```env
MONGODB_URI=mongodb://localhost:27017/habittracker
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
PORT=5000
FRONTEND_URL=http://localhost:8080
```

5. **Start MongoDB** (if running locally):
```bash
# On Windows (if installed as service, it should auto-start)
# Or use MongoDB Atlas for cloud database
```

6. **Start backend server:**
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

---

### Frontend Setup

1. **Install new dependencies:**
```bash
npm install
```

This will install `axios` which was added to `package.json`.

2. **Create `.env` file in root directory:**
```env
VITE_API_URL=http://localhost:5000/api
```

3. **Start frontend:**
```bash
npm run dev
```

Frontend will run on `http://localhost:8080`

---

## ✅ What's Been Migrated

### Backend ✅
- [x] Express.js server setup
- [x] MongoDB connection
- [x] All 7 Mongoose models (User, Habit, HabitEntry, Team, TeamMember, Notification, UserStats)
- [x] JWT authentication system
- [x] Auth routes (signup, signin, signout, refresh, getCurrentUser)
- [x] Habits API (CRUD operations + complete habit)
- [x] Error handling middleware
- [x] CORS configuration

### Frontend ✅
- [x] API client with axios
- [x] Auth service
- [x] Auth context/provider
- [x] Updated App.tsx with AuthProvider
- [x] Updated ProtectedRoute to use new auth
- [x] Updated Auth page to use new auth
- [x] Updated Navbar to use new auth

---

## 🧪 Testing

### Test Backend

1. **Health check:**
```bash
curl http://localhost:5000/health
```

2. **Sign up:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

3. **Sign in:**
```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Test Frontend

1. Open `http://localhost:8080`
2. Click "Get Started" or navigate to `/auth`
3. Create an account
4. You should be redirected to dashboard

---

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For MongoDB Atlas, ensure IP is whitelisted

**Port Already in Use:**
- Change `PORT` in `.env`
- Or kill process using port 5000

**JWT Errors:**
- Ensure `JWT_SECRET` and `JWT_REFRESH_SECRET` are set in `.env`
- Use strong, random strings

### Frontend Issues

**CORS Errors:**
- Ensure `FRONTEND_URL` in backend `.env` matches frontend URL
- Check backend CORS configuration

**401 Unauthorized:**
- Check token is being sent in headers
- Verify token format: `Bearer <token>`
- Check token expiration

**API Connection Errors:**
- Verify `VITE_API_URL` in frontend `.env`
- Ensure backend server is running
- Check network tab in browser DevTools

---

## 📝 Next Steps

### Still To Do:

1. **Backend:**
   - [ ] Teams API
   - [ ] Analytics API
   - [ ] Notifications API
   - [ ] Contact email service
   - [ ] Stats calculation service
   - [ ] Streak calculation

2. **Frontend:**
   - [ ] Update Dashboard to fetch habits from API
   - [ ] Update HabitCard to use API
   - [ ] Update HabitDialog to use API
   - [ ] Update Analytics page
   - [ ] Update Teams page
   - [ ] Update Contact page
   - [ ] Remove Supabase dependencies

3. **Cleanup:**
   - [ ] Delete `src/integrations/supabase/` directory
   - [ ] Delete `supabase/` directory
   - [ ] Remove `@supabase/supabase-js` from package.json

---

## 📚 Documentation

- **Main Plan:** `MERN_MIGRATION_PLAN.md`
- **Backend Setup:** `QUICK_START_BACKEND.md`
- **Frontend Checklist:** `FRONTEND_MIGRATION_CHECKLIST.md`
- **MongoDB Schemas:** `backend-schemas-example.md`
- **Summary:** `MIGRATION_SUMMARY.md`

---

## 🎉 Success!

If you can:
- ✅ Sign up a new user
- ✅ Sign in
- ✅ See the dashboard
- ✅ Create a habit (once Dashboard is updated)

Then the core migration is working! 🚀

