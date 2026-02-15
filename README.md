# Job Listing Portal - Production Setup Guide

## 🔐 Authentication System

This application features a **production-ready, secure authentication system** with:

✅ **Password Security**
- bcrypt hashing with salt
- Strong password requirements (8+ characters, uppercase, lowercase, numbers, special characters)
- Secure password reset (ready to implement)

✅ **JWT Token Authentication**
- Access tokens (7 days)
- Refresh tokens (30 days) in HTTP-only cookies
- Token expiration handling

✅ **API Security**
- Rate limiting (5 login attempts per 15 minutes)
- Helmet.js security headers
- CORS whitelist configuration
- Input sanitization (XSS & NoSQL injection prevention)
- Payload size limits (10MB)

✅ **Session Management**
- HTTP-only secure cookies
- CSRF protection
- Role-based access (candidate/employer)

---

## 🚀 Environment Setup

### 1. Install Dependencies

#### Backend:
```bash
cd server
npm install
```

#### Frontend:
```bash
npm install
```

### 2. Configure Environment Variables

Create `server/.env` file (copy from `.env.example`):

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Security Notes:**
- ✅ `.env` is already in `.gitignore` - your credentials are safe!
- Use a strong JWT_SECRET (64+ random characters recommended)
- Change NODE_ENV to `production` when deploying

### 3. MongoDB Atlas Setup

#### Get Your Connection String:
1. Go to https://cloud.mongodb.com
2. Click **"Database"** in left sidebar (NOT Data Federation)
3. Click **"Connect"** on your cluster
4. Select **"Drivers"**
5. Copy the connection string: `mongodb+srv://username:<password>@cluster...`
6. Replace `<password>` with your actual database password
7. Add database name: `mongodb+srv://...mongodb.net/job-portal?retryWrites=true...`

#### Whitelist Your IP:
1. Go to **"Network Access"** in MongoDB Atlas
2. Click **"Add IP Address"**
3. Add `0.0.0.0/0` (allow all) for development
4. For production, add your server's IP address only

---

## 🔧 Troubleshooting MongoDB Connection

### Error: `querySrv ECONNREFUSED`

This means the DNS cannot resolve MongoDB's SRV records. **Solutions:**

#### Option 1: Check Network Access
1. Verify IP whitelist in MongoDB Atlas → Network Access
2. Wait 2-3 minutes after adding IP for changes to propagate
3. Try different network (disable VPN, try mobile hotspot)

#### Option 2: Flush DNS Cache
```powershell
# Windows
ipconfig /flushdns

# Mac/Linux
sudo dscacheutil -flushcache
```

#### Option 3: Use Standard Connection String
Instead of `mongodb+srv://`, request the standard format from MongoDB Atlas:
1. Connect → Drivers → "I have MongoDB 4.0 or earlier"
2. Use the `mongodb://` format (non-SRV)

#### Option 4: Test with MongoDB Compass
1. Download MongoDB Compass
2. Test your connection string there first
3. If it works in Compass, it should work in the app

---

## 🏃 Running the Application

### Development Mode (Both Servers):
```bash
npm run dev
```

This starts:
- Backend on `http://localhost:5000`
- Frontend on `http://localhost:3000`

### Separate Servers:

#### Backend Only:
```bash
cd server
npm start
```

#### Frontend Only:
```bash
npm run dev
```

---

## 🧪 Testing Authentication

### 1. Sign Up
- Visit: `http://localhost:3000/auth/signup`
- Create account with:
  - **Password requirements**: Min 8 chars, uppercase, lowercase, numbers, special characters
  - Choose role: Candidate or Employer

### 2. Login
- Visit: `http://localhost:3000/auth/login`
- **Rate limited**: 5 attempts per 15 minutes

### 3. Profile Pages
- **Candidate**: `http://localhost:3000/dashboard/candidate/profile`
- **Employer**: `http://localhost:3000/dashboard/employer/profile`

### 4. Test Security Features
- Try weak passwords (will be rejected)
- Try SQL injection in email: `' OR '1'='1` (will be sanitized)
- Try 6 rapid login attempts (will be rate limited)

---

## 🌐 Production Deployment

### Environment Variables

Update `server/.env` for production:
```env
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
MONGO_URI=mongodb+srv://...production_cluster...
JWT_SECRET=<64_character_random_string>
```

### Security Checklist

- [ ] Change JWT_SECRET to 64+ character strong secret
- [ ] Set NODE_ENV=production
- [ ] Update FRONTEND_URL to your domain
- [ ] MongoDB Atlas: whitelist only server IP (remove 0.0.0.0/0)
- [ ] Enable HTTPS/SSL
- [ ] Set up MongoDB backups
- [ ] Configure error monitoring (Sentry, etc.)
- [ ] Set up logging service
- [ ] Review CORS whitelist in `server/index.js`

### Deployment Platforms

**Backend:**
- Heroku
- Railway
- Render
- AWS EC2

**Frontend:**
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify

---

## 📊 Security Features Implemented

| Feature | Status | Description |
|---------|--------|-------------|
| Password Hashing | ✅ | bcrypt with salt |
| Password Strength | ✅ | 8+ chars, mixed case, numbers, special chars |
| JWT Tokens | ✅ | Access (7d) + Refresh (30d) tokens |
| HTTP-Only Cookies | ✅ | Prevents XSS attacks |
| Rate Limiting | ✅ | 5 login attempts per 15 min |
| Helmet.js | ✅ | Security headers |
| CORS Whitelist | ✅ | Origin validation |
| Input Sanitization | ✅ | XSS & NoSQL injection prevention |
| Email Validation | ✅ | Regex validation |
| Role Validation | ✅ | candidate/employer only |
| Error Handling | ✅ | No sensitive data in errors |
| Payload Limits | ✅ | 10MB max |

---

## 🔍 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Profile
- `GET /api/profile` - Get user profile (protected)
- `PUT /api/profile` - Update profile (protected)

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create job (employers only)

### Applications
- `POST /api/applications` - Apply to job (candidates only)
- `GET /api/applications` - Get applications

---

## 📞 Support

If MongoDB connection issues persist:
1. Check MongoDB Atlas dashboard for cluster status
2. Verify your cluster tier (free tier has limitations)
3. Try creating a new cluster
4. Contact MongoDB Atlas support

For other issues, review the implementation plan and walkthrough artifacts.

---

## 🎯 Next Steps

1. ✅ Resolve MongoDB connection
2. Test complete authentication flow
3. Implement email verification (optional)
4. Add password reset functionality
5. Set up production deployment
6. Configure monitoring and logging

**Your credentials are secure - `.env` is in `.gitignore`!** ✅
