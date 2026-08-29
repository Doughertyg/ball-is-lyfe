# 🎯 Local Development Setup Guide

This guide walks new developers through setting up the Ball is Lyfe project for local development. It should take about 15-20 minutes.

## Table of Contents

1. [Prerequisites Check](#prerequisites-check)
2. [Clone & Install](#clone--install)
3. [MongoDB Setup](#mongodb-setup)
4. [Generate Secrets](#generate-secrets)
5. [Configure Environment](#configure-environment)
6. [Start Development](#start-development)
7. [Verify Everything Works](#verify-everything-works)
8. [Common Issues](#common-issues)

---

## Prerequisites Check

### Install Node.js

If you don't have Node.js installed:

1. Visit https://nodejs.org/
2. Download the **LTS (Long Term Support)** version
3. Run the installer and follow the prompts
4. Verify installation:

```bash
node --version  # Should show v16.x or higher
npm --version   # Should show 7.x or higher
```

### Other Requirements

- **Git** - For version control (usually pre-installed on macOS/Linux)
- **Terminal/Command Prompt** - For running commands
- **Text Editor** - VS Code recommended ([Download](https://code.visualstudio.com/))

---

## Clone & Install

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ball-is-lyfe.git
cd ball-is-lyfe
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages from `package.json`. This may take 2-3 minutes.

**Expected output:**
```
added XXX packages in Xs
```

---

## MongoDB Setup

The app uses MongoDB for the database. You have **two options**:

### Option A: Local MongoDB (Recommended for Offline Development) ⭐

Run MongoDB on your computer for completely offline development - no internet needed!

#### 1. Install MongoDB Locally

**Using Homebrew (macOS):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Using Docker (All platforms):**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Using Windows:**
- Download from https://www.mongodb.com/try/download/community
- Run the installer

#### 2. Verify MongoDB is Running

```bash
# Should work without error
mongo mongodb://localhost:27017
```

In `.env.local`, use:
```env
MONGODB=mongodb://localhost:27017/ball-is-lyfe-dev
```

**Benefits:**
- ✅ Works completely offline
- ✅ No internet connection needed
- ✅ No MongoDB Atlas account required
- ✅ Fast local development
- ✅ Easy to reset/clear data

---

### Option B: MongoDB Atlas Cloud (Requires Internet)

Use MongoDB's cloud database if you prefer managed setup.

#### 1. Create MongoDB Atlas Account

1. Visit https://www.mongodb.com/cloud/atlas
2. Click "Sign Up" and create an account (email or Google)
3. Verify your email address

#### 2. Create a Cluster

1. After signing up, click "Create a deployment"
2. Select **"Shared Cluster"** (free tier)
3. Choose your preferred region (geographically closest)
4. Click "Create Cluster" and wait 1-3 minutes

#### 3. Set Up Database User

1. In the MongoDB Atlas dashboard, click **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication method
4. Enter a username (e.g., `ball-lyfe-dev`)
5. Enter a strong password (copy this, you'll need it)
6. Select **"Built-in Role"** → **"readWriteAnyDatabase"**
7. Click "Add User"

#### 4. Whitelist Your IP

1. Click **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. For development: Click **"Add Current IP Address"** to whitelist your current IP
   - Or for easier development: Add **0.0.0.0/0** (allows all IPs, less secure)
4. Click "Confirm"

#### 5. Get Connection String

1. Click **"Database"** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Drivers"** → **"Node.js"**
4. Copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster.mongodb.net/`
5. **Replace `<password>` with your actual password**
6. **Replace `myFirstDatabase` with `ball-is-lyfe-dev`**

In `.env.local`, use:
```env
MONGODB=mongodb+srv://ball-lyfe-dev:MySecurePassword123@cluster0.2k6ad.mongodb.net/ball-is-lyfe-dev?retryWrites=true&w=majority
```

**Benefits:**
- ✅ No local setup needed
- ✅ Managed by MongoDB
- ✅ Works from anywhere
- ✅ Can be shared with team (separate credentials)

**Drawbacks:**
- ❌ Requires internet connection
- ❌ Requires MongoDB Atlas account
- ❌ Slightly slower than local (network latency)

---

### Which Option Should I Choose?

**Choose Local MongoDB if:**
- ✅ You often work offline or on flights
- ✅ You want the fastest local development
- ✅ You don't want extra accounts to manage
- ✅ You're doing lots of testing/data manipulation
- ✅ You're new to development

**Choose MongoDB Atlas if:**
- ✅ You already have an Atlas account
- ✅ You need to share data with teammates
- ✅ You prefer "managed" solutions
- ✅ You're always connected to internet

---

## Generate Secrets

The app uses JWT tokens for authentication. Generate random secret keys:

### Using OpenSSL (macOS/Linux)

```bash
# Generate SECRET_KEY (copy the output)
openssl rand -hex 32

# Generate REFRESH_SECRET (copy the output)
openssl rand -hex 32
```

### Using Node.js (Windows or if OpenSSL not available)

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run this command twice and copy the results for both secrets.

**Example output:**
```
f3a8c9d2e1b4a5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8
```

---

## Configure Environment

### 1. Create Local Environment File

```bash
cp .env.example .env.local
```

This creates `.env.local` from the template (`.env.local` is git-ignored for security).

### 2. Edit `.env.local`

Open `.env.local` in your text editor and fill in the values:

**For Local MongoDB (Recommended):**
```env
# Local MongoDB (offline development)
MONGODB=mongodb://localhost:27017/ball-is-lyfe-dev

# Copy your generated SECRET_KEY
SECRET_KEY=f3a8c9d2e1b4a5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8

# Copy your generated REFRESH_SECRET
REFRESH_SECRET=a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0

# Keep these as-is for local development
NODE_ENV=local
PORT=3000
ORIGIN=http://localhost:3000
GRAPHQL_ADDRESS=http://localhost:3000/graphql
GOOGLE_CLIENT_ID=

# Optional
LOG_LEVEL=debug
```

**For MongoDB Atlas (Cloud):**
```env
# Copy your MongoDB connection string
MONGODB=mongodb+srv://ball-lyfe-dev:MyPassword@cluster0.2k6ad.mongodb.net/ball-is-lyfe-dev?retryWrites=true&w=majority

# ... (rest same as above)
```

### ⚠️ Security Reminder

- **Never commit `.env.local`** to git (it's in `.gitignore`)
- **Never share your secrets** via email or Slack
- **Never push `.env` files** to GitHub

---

## Start Development

Open **3 separate terminal windows** in the project directory.

### Terminal 1: Start Backend Server

```bash
npm run start-dev
```

**Expected output:**
```
✅ Connected to MongoDB
🚀 Server running!
   GraphQL: http://localhost:3000/graphql
   Environment: local
   Port: 3000
```

### Terminal 2: Start Frontend Dev Server

```bash
npm run serve
```

**Expected output:**
```
ℹ ｢wds｣: Project is running at http://localhost:3000/
```

### Terminal 3: Watch CSS Changes (Tailwind)

```bash
npm run tailwind
```

**Expected output:**
```
Rebuilding...
✅ Done in XXms.
```

---

## Verify Everything Works

### 1. Check the App

Open your browser to http://localhost:3000

You should see the Ball is Lyfe app load. If it doesn't:
- Check all 3 terminals are running
- Look for error messages in the terminal output
- See [Common Issues](#common-issues) below

### 2. Check GraphQL

Visit http://localhost:3000/graphql

You should see the Apollo GraphQL playground. This means the backend is working.

### 3. Check Browser Console

Open DevTools (F12 or Cmd+Option+I on macOS):
- Click **Console** tab
- You should NOT see red errors

### 4. Test a Simple Action

Try to log in or navigate around the app. Check:
- Data loads from GraphQL
- No network errors in the Network tab
- Console shows no errors

---

## Common Issues

### ❌ "Cannot connect to MongoDB"

**Problem:** Backend won't start, shows database connection error

**Solutions:**
1. Verify `MONGODB` in `.env.local` is correct
2. Check MongoDB Atlas IP whitelist includes your IP:
   - Go to Network Access in MongoDB Atlas
   - If you're on a different network, add current IP
3. Verify database user password is correct (no special characters without escaping)
4. Test connection string in MongoDB Atlas: click "Connect" and "Test Connection"

### ❌ "Port 3000 already in use"

**Problem:** `Error: listen EADDRINUSE :::3000`

**Solutions:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 npm run start-dev
```

### ❌ "GraphQL endpoint not found / Network error"

**Problem:** Frontend can't reach the backend

**Solutions:**
1. Make sure backend is running (Terminal 1 shows "Server running")
2. Check `GRAPHQL_ADDRESS` in `.env.local` is correct
3. Check CORS origin matches (`ORIGIN=http://localhost:3000`)
4. Look for errors in browser DevTools Network tab

### ❌ "npm packages not installing"

**Problem:** `npm install` fails

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### ❌ "Webpack build errors"

**Problem:** `npm run serve` fails

**Solutions:**
1. Check Node version is 16.x+: `node --version`
2. Delete node_modules and reinstall: `rm -rf node_modules && npm install`
3. Check for syntax errors in `.env.local`

---

## Next Steps

Congratulations! Your local environment is ready. 🎉

### Learn the Codebase

1. **Read `README.md`** - Project overview and tech stack
2. **Explore `app/` folder** - React components and structure
3. **Look at `graphql/typeDefs.js`** - Available queries and mutations
4. **Check `server/index.js`** - Backend server setup

### Find Something to Work On

- Look for issues labeled `good first issue`
- Start with a small bug fix or UI improvement
- Ask a team member for suggestions

### Ask Questions

- Check existing documentation in `docs/`
- Ask team members in Slack/Discord
- Open an issue with your question

---

## Still Need Help?

- **GitHub Issues**: Create an issue with your problem
- **Troubleshooting Docs**: Check `docs/TROUBLESHOOTING.md`
- **Team Chat**: Ask in #development or #help channel

Happy coding! ⚽🚀
