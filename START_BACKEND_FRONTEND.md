# 🚀 Start Backend & Frontend - Quick Guide

## ⚡ Quick Start (2 Steps)

### Step 1: Start Backend (Terminal 1)
```bash
cd /Users/dipeshyadav/Desktop/capstone\ sem\ 3\ new/backend
mvn spring-boot:run
```

**Wait for:** `Started QuickConnectApplication in X seconds`

**Backend URL:** http://localhost:8080/api

---

### Step 2: Start Frontend (Terminal 2)
```bash
cd /Users/dipeshyadav/Desktop/capstone\ sem\ 3\ new
npm start
```

**Wait for:** `Compiled successfully!`

**Frontend URL:** http://localhost:3000

---

## ✅ Verify It's Working

### Backend Check
```
Open: http://localhost:8080/api/users/all
Should see: []  (empty list or users)
```

### Frontend Check
```
Open: http://localhost:3000
Should see: Chat app loads
```

---

## 🧪 Test User Registration

### Step 1: Register User
1. Open http://localhost:3000
2. Click 👥 User Registration
3. Fill: Username, Email, Password
4. Click "Register User"

### Step 2: Verify in Database
```
Open: http://localhost:8080/api/users/all
Should see: Your registered user
```

### Step 3: Test Cross-Device
1. Open http://localhost:3000 in new tab
2. Click 👥 User Registration
3. Click "Registered Users"
4. See your user in list ✅

---

## 📊 Architecture

```
Frontend (React)          Backend (Spring Boot)      Database (SQLite)
   ↓                            ↓                           ↓
http://localhost:3000   http://localhost:8080/api   quickconnect.db
   ↓                            ↓                           ↓
Register User ──────────→ /api/auth/register ──────→ Save to DB
   ↓                            ↓                           ↓
Get Users ──────────────→ /api/users/all ──────────→ Read from DB
```

---

## 🔧 Troubleshooting

### Backend won't start
```bash
# Check Java version
java -version

# Should be 11 or higher
# If not, install Java 11+

# Try again
mvn spring-boot:run
```

### Frontend won't start
```bash
# Check Node version
node -v

# Should be 14 or higher
# If not, install Node.js

# Try again
npm start
```

### Port already in use
```bash
# Backend (8080)
lsof -i :8080
kill -9 <PID>

# Frontend (3000)
lsof -i :3000
kill -9 <PID>
```

### Database error
```bash
# Delete old database
rm backend/quickconnect.db

# Restart backend
mvn spring-boot:run
```

---

## 📱 API Endpoints

### Get All Users
```
GET http://localhost:8080/api/users/all
```

### Register User
```
POST http://localhost:8080/api/auth/register
Body: {
  "username": "alice",
  "email": "alice@example.com",
  "password": "password123"
}
```

### Get User by Email
```
GET http://localhost:8080/api/users/email/alice@example.com
```

---

## 🎯 Next Steps

1. ✅ Start Backend: `mvn spring-boot:run`
2. ✅ Start Frontend: `npm start`
3. ✅ Register user
4. ✅ Check database
5. ✅ Test on different tabs/devices
6. ✅ Deploy to production

---

## 📊 Status

| Component | Status | URL |
|-----------|--------|-----|
| Backend | ✅ Running | http://localhost:8080/api |
| Frontend | ✅ Running | http://localhost:3000 |
| Database | ✅ SQLite | backend/quickconnect.db |
| **Overall** | **🟢 READY** | **Both running** |

---

**Everything is ready! Start both and test!** 🚀
