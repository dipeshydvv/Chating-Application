# 🚀 Deploy Commands - Copy & Paste Ready

## ⚡ Fastest Deployment (5 Minutes)

### Step 1: Build Frontend
```bash
npm run build
```

### Step 2: Deploy to Netlify
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=build
```

**Result:** Frontend is live! ✅

---

### Step 3: Deploy Backend to Heroku
```bash
cd backend
heroku login
heroku create quick-connect-api
git push heroku main
```

**Result:** Backend is live! ✅

---

## 📋 Complete Deployment Commands

### Frontend Setup

#### Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### Login to Netlify
```bash
netlify login
```

#### Build Application
```bash
npm run build
```

#### Deploy to Production
```bash
netlify deploy --prod --dir=build
```

#### View Deployment
```bash
netlify open
```

#### Check Logs
```bash
netlify logs
```

---

### Backend Setup

#### Login to Heroku
```bash
heroku login
```

#### Create Heroku App
```bash
cd backend
heroku create quick-connect-api
```

#### Set Environment Variables
```bash
heroku config:set SPRING_PROFILES_ACTIVE=production
heroku config:set JWT_SECRET=your_secret_key
heroku config:set DATABASE_URL=your_database_url
```

#### Deploy to Heroku
```bash
git push heroku main
```

#### View Backend Logs
```bash
heroku logs --tail
```

#### Open Backend
```bash
heroku open
```

---

## 🔄 Continuous Deployment

### Set Up Git Push Deployment

#### Add Heroku Remote
```bash
heroku git:remote -a quick-connect-api
```

#### Deploy on Push
```bash
git push heroku main
```

#### View Deployment Status
```bash
heroku releases
```

---

## 🗄️ Database Setup

### PostgreSQL on Heroku

#### Create Database
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

#### Get Database URL
```bash
heroku config:get DATABASE_URL
```

#### Connect to Database
```bash
heroku pg:psql
```

#### View Database Info
```bash
heroku pg:info
```

---

## 🌐 Domain Configuration

### Add Custom Domain

#### On Netlify
```bash
netlify domain:add quickconnect.app
```

#### Update DNS Records
```
CNAME: www.quickconnect.app → quick-connect-chat.netlify.app
A: 75.2.60.5
```

#### Verify Domain
```bash
netlify domain:list
```

---

## 📊 Monitoring Commands

### Frontend Monitoring

#### View Build Status
```bash
netlify status
```

#### View Deployment History
```bash
netlify deploy:list
```

#### View Site Analytics
```bash
netlify analytics:view
```

---

### Backend Monitoring

#### View Application Logs
```bash
heroku logs --tail
```

#### View Specific Logs
```bash
heroku logs --tail --source app
```

#### View Error Logs
```bash
heroku logs --tail --source app | grep ERROR
```

#### View Dyno Status
```bash
heroku ps
```

#### View Metrics
```bash
heroku metrics
```

---

## 🔐 Environment Variables

### Set Frontend Variables

#### Create .env file
```bash
cat > .env << EOF
REACT_APP_API_URL=https://quick-connect-api.herokuapp.com
REACT_APP_ENV=production
EOF
```

#### Verify Variables
```bash
cat .env
```

---

### Set Backend Variables

#### Set on Heroku
```bash
heroku config:set \
  SPRING_PROFILES_ACTIVE=production \
  JWT_SECRET=your_jwt_secret \
  DATABASE_URL=your_database_url
```

#### View Variables
```bash
heroku config
```

#### Update Variable
```bash
heroku config:set JWT_SECRET=new_secret
```

#### Remove Variable
```bash
heroku config:unset JWT_SECRET
```

---

## 🧪 Testing Commands

### Test Frontend Build
```bash
npm run build
ls -lh build/
```

### Test Backend Build
```bash
cd backend
mvn clean package
ls -lh target/
```

### Test API Endpoint
```bash
curl https://quick-connect-api.herokuapp.com/api/auth/verify
```

### Test CORS
```bash
curl -i -X OPTIONS https://quick-connect-api.herokuapp.com/api/messages
```

### Test Database Connection
```bash
heroku pg:psql -c "SELECT 1"
```

---

## 🔄 Rollback Commands

### Rollback Frontend
```bash
netlify deploy:list
netlify deploy --prod --dir=build
```

### Rollback Backend
```bash
heroku releases
heroku rollback
```

---

## 🧹 Cleanup Commands

### Clear Netlify Cache
```bash
netlify cache:clear
```

### Clear Heroku Cache
```bash
heroku builds:cache:purge
```

### Clear npm Cache
```bash
npm cache clean --force
```

---

## 📱 Local Testing Commands

### Start Frontend Locally
```bash
npm start
```

### Start Backend Locally
```bash
cd backend
mvn spring-boot:run
```

### Test with Curl
```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Get Messages
curl http://localhost:8080/api/messages/1
```

---

## 📊 Deployment Verification

### Verify Frontend
```bash
# Check if site is live
curl -I https://quick-connect-chat.netlify.app

# Should return 200 OK
```

### Verify Backend
```bash
# Check if API is live
curl -I https://quick-connect-api.herokuapp.com/api/auth/verify

# Should return 200 OK
```

### Verify Database
```bash
# Check database connection
heroku pg:info
```

---

## 🆘 Troubleshooting Commands

### Check Node Version
```bash
node --version
npm --version
```

### Check Java Version
```bash
java -version
mvn --version
```

### Check Git Status
```bash
git status
git log --oneline -5
```

### Check Netlify Status
```bash
netlify status
netlify env:list
```

### Check Heroku Status
```bash
heroku status
heroku ps
```

---

## 📝 Quick Reference

### Most Used Commands

```bash
# Build
npm run build

# Deploy Frontend
netlify deploy --prod --dir=build

# Deploy Backend
git push heroku main

# View Logs
netlify logs
heroku logs --tail

# Check Status
netlify status
heroku status
```

---

## 🎯 Deployment Workflow

```bash
# 1. Build
npm run build

# 2. Test
npm run build 2>&1 | grep -i error

# 3. Deploy Frontend
netlify deploy --prod --dir=build

# 4. Deploy Backend
git push heroku main

# 5. Verify
curl https://quick-connect-api.herokuapp.com/api/auth/verify

# 6. Monitor
netlify logs
heroku logs --tail
```

---

## 🚀 One-Line Deployment

### Frontend Only
```bash
npm run build && netlify deploy --prod --dir=build
```

### Backend Only
```bash
git push heroku main && heroku logs --tail
```

### Full Deployment
```bash
npm run build && netlify deploy --prod --dir=build && git push heroku main && heroku logs --tail
```

---

## ✅ Deployment Checklist

- [ ] Run: `npm run build`
- [ ] Run: `netlify login`
- [ ] Run: `netlify deploy --prod --dir=build`
- [ ] Run: `heroku login`
- [ ] Run: `heroku create quick-connect-api`
- [ ] Run: `git push heroku main`
- [ ] Run: `curl https://quick-connect-api.herokuapp.com/api/auth/verify`
- [ ] Test frontend at: https://quick-connect-chat.netlify.app
- [ ] Test backend at: https://quick-connect-api.herokuapp.com

---

## 🎉 Deployment Complete!

Your application is now live and accessible worldwide! 🌍

**Frontend:** https://quick-connect-chat.netlify.app
**Backend:** https://quick-connect-api.herokuapp.com

---

**Copy and paste these commands to deploy your application!** 🚀
