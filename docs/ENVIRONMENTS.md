# 🌍 Environment Configuration Guide

This guide explains how the Ball is Lyfe project handles different environments and how to configure them.

## Current Environment Setup

The project supports three environments:

| Environment | Purpose | Status | Database | Branch |
|---|---|---|---|---|
| **local** | Your computer for development | ✅ Active | Local MongoDB OR team dev cluster | N/A (local only) |
| **dev** | Staging/Testing | ✅ Active | Team dev MongoDB Atlas cluster | `develop` |
| **production** | Live app for users | ✅ Active | Production MongoDB cluster | `main` |

### Key Points

- **Local** can use either local MongoDB (for offline) or the dev cluster once it's created
- **Dev** is the staging environment where features are tested before production
- **Production** is live and actively serving users

---

## Environment Variables System

### How It Works

1. **Node.js runs** - It checks the `NODE_ENV` variable
2. **Configuration loads** - `config/env.js` loads the appropriate `.env` file
3. **Variables validated** - Required variables are checked
4. **App starts** - With the correct configuration

### File Priority

The system looks for environment files in this order:

1. `.env.{NODE_ENV}` - Environment-specific file (`.env.local`)
2. `.env` - Default file (only in production)
3. Process environment variables - Set in hosting platform

### Required Variables

These variables **must** be set for the app to start:

- `MONGODB` - Database connection string (local OR Atlas)
- `SECRET_KEY` - JWT access token secret
- `REFRESH_SECRET` - JWT refresh token secret

### Optional Variables

These have defaults but can be overridden:

- `NODE_ENV` - Default: `local`
- `PORT` - Default: `3000`
- `ORIGIN` - Default: `http://localhost:3000`
- `GRAPHQL_ADDRESS` - Default: `http://localhost:3000/graphql`
- `GOOGLE_CLIENT_ID` - Default: empty (OAuth disabled)
- `LOG_LEVEL` - Default: `info`

---

## Local Development (.env.local)

### Purpose
Development on your personal computer.

### Database Options

You have flexibility in choosing your database:

#### Option A: Local MongoDB (Recommended) ⭐

```env
NODE_ENV=local
MONGODB=mongodb://localhost:27017/ball-is-lyfe-dev
SECRET_KEY=your-local-secret-here
REFRESH_SECRET=your-local-refresh-secret-here
ORIGIN=http://localhost:3000
GRAPHQL_ADDRESS=http://localhost:3000/graphql
LOG_LEVEL=debug
```

**Advantages:**
- ✅ Works completely offline
- ✅ No internet connection needed
- ✅ No MongoDB Atlas account required
- ✅ Fast development
- ✅ Easy to reset/clear database

**Setup:** See [LOCAL_SETUP.md - MongoDB Setup Option A](./LOCAL_SETUP.md#option-a-local-mongodb-recommended-for-offline-development-)

---

#### Option B: Team Dev MongoDB Cluster

Use the team-provided shared dev cluster when you need shared staging data:

```env
NODE_ENV=local
MONGODB=mongodb+srv://dev-user:password@cluster-dev.mongodb.net/ball-is-lyfe-dev?retryWrites=true&w=majority
SECRET_KEY=your-local-secret-here
REFRESH_SECRET=your-local-refresh-secret-here
ORIGIN=http://localhost:3000
GRAPHQL_ADDRESS=http://localhost:3000/graphql
LOG_LEVEL=debug
```

**Advantages:**
- ✅ Can test with shared team data
- ✅ Data syncs with dev environment
- ✅ Closer to production setup

**Status:** Active. Request the connection string through the team's approved secret-sharing process. Do not create a personal Atlas account or cluster for this project.

---

### Running Locally

```bash
# .env.local is automatically loaded
npm run start-dev      # Start backend
npm run serve          # Start frontend in another terminal
npm run tailwind       # Watch CSS in third terminal
```

### Security
- **Never commit** `.env.local`
- **Never share** your secrets
- It's in `.gitignore` - you're safe!

---

## Development Environment (.env.dev)

### Purpose
Shared staging/testing environment where features are tested before production release.

The dev environment is already configured and deploys the `develop` branch:

```env
NODE_ENV=development
PORT=3000
MONGODB=mongodb+srv://dev-user:dev-password@cluster-dev.mongodb.net/ball-is-lyfe-dev?retryWrites=true&w=majority
SECRET_KEY=dev-secret-key-here
REFRESH_SECRET=dev-refresh-secret-here
ORIGIN=https://dev.recleaguenation.com
GRAPHQL_ADDRESS=https://dev.recleaguenation.com/graphql
GOOGLE_CLIENT_ID=dev-google-client-id
LOG_LEVEL=info
```

### Features

- **Shared Database** - Dev MongoDB Atlas cluster (separate from production)
- **Staging URL** - `https://dev.recleaguenation.com`
- **CI/CD** - Auto-deploy from `develop` branch
- **Testing** - Team can test features before production merge
- **Separate Credentials** - Different database user/password than production

### Deployment Workflow

```bash
# Features go to develop branch
git checkout develop
git pull origin develop

# Make changes
# ... code ...

# Commit and push
git commit -m "Feature description"
git push origin develop

# Auto-deployed to dev environment
# Test at https://dev.recleaguenation.com

# After testing, merge to main for production
git checkout main
git pull origin main
git merge develop
git push origin main
```

### Purpose
Live app serving real users at https://RecLeagueNation.com

The production environment is already configured on Render and Netlify. Production configuration is managed by project administrators.

#### Production runtime values

```
NODE_ENV=production
MONGODB=mongodb+srv://prod-user:prod-password@cluster-prod.mongodb.net/ball-is-lyfe?retryWrites=true&w=majority
SECRET_KEY=your-production-secret-key
REFRESH_SECRET=your-production-refresh-secret
ORIGIN=https://recleaguenation.com
GRAPHQL_ADDRESS=https://recleaguenation.com/graphql
GOOGLE_CLIENT_ID=your-production-google-client-id
LOG_LEVEL=warn
```

#### Production frontend values

```
GRAPHQL_ADDRESS=https://recleaguenation.com/graphql
GOOGLE_CLIENT_ID=your-production-google-client-id
```

### Database
- **Production MongoDB Atlas cluster** with dedicated credentials
- Completely separate from local development
- Only core team members have access
- Regular automated backups
- Connection string stored securely in Render

### Security Best Practices

1. **Use strong secrets** - Long, random values (64+ characters)
2. **Rotate secrets regularly** - Every 3-6 months
3. **Never log secrets** - Check logs don't expose sensitive data
4. **Restrict access** - Only deploy with authorized credentials
5. **Monitor logs** - Watch for suspicious activity
6. **Backup regularly** - Test restore procedures
7. **Use separate database** - Never share prod/dev credentials

### Deployment Process

Merge verified changes from `develop` into `main`. The existing Render and Netlify production services deploy from `main`.

---

## Generating Secure Secrets

### Using OpenSSL (macOS/Linux)

```bash
openssl rand -hex 32
```

### Using Node.js

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Using Python

```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

### Requirements
- **At least 32 characters** (64 hex characters)
- **Random and unique** - Different for each secret
- **Not words or patterns** - True random values
- **Different per environment** - Never reuse secrets

---

## MongoDB Connection Strings Explained

### Local MongoDB

```
mongodb://localhost:27017/ball-is-lyfe-dev
```

- `mongodb://` - MongoDB protocol
- `localhost:27017` - Local machine, default MongoDB port
- `/ball-is-lyfe-dev` - Database name

### MongoDB Atlas

```
mongodb+srv://username:password@cluster0.mongodb.net/ball-is-lyfe-dev?retryWrites=true&w=majority
```

- `mongodb+srv://` - MongoDB Atlas protocol (encrypted)
- `username:password` - Your database user credentials
- `@cluster0.mongodb.net` - MongoDB Atlas cluster
- `/ball-is-lyfe-dev` - Database name
- `?retryWrites=true&w=majority` - Reliability options

---

## Managing Multiple Environments Safely

### Checklist

- [ ] `.env` and `.env.local` in `.gitignore`
- [ ] `.env.example` committed to git (no secrets!)
- [ ] Different secrets for each environment
- [ ] Production secrets stored securely in platform
- [ ] Secrets rotated regularly (every 3-6 months)
- [ ] Access restricted to authorized team members
- [ ] Logs don't contain sensitive data
- [ ] Separate MongoDB databases per environment

---

## Troubleshooting Environment Issues

### "Missing required environment variable"

The app exits if required variables aren't set.

**Fix:**
1. Check `.env.local` exists for local work
2. Verify variable name is spelled correctly
3. Make sure it's not commented out
4. Check value is not empty

### "Can't connect to MongoDB"

**If using local MongoDB:**
1. Verify MongoDB is running: `mongo mongodb://localhost:27017`
2. Check port is 27017 (default)
3. Restart MongoDB service

**If using Atlas:**
1. Check connection string is correct
2. Verify IP is whitelisted in MongoDB Atlas
3. Verify username/password are correct

### "Wrong database - data looks different"

Wrong connection string or database name.

**Fix:**
1. Check `.env.local` MONGODB value
2. Verify it points to correct database
3. Confirm MongoDB instance is running (if local)
4. Restart the server

### "Secrets work in local but not production"

Production variables not set correctly.

**Fix:**
1. Compare your setup with this guide
2. Ask a project administrator to verify hosted configuration
3. Make sure no typos in variable names
4. Restart services in hosting platform
5. Check logs for errors

---

## Summary

| Aspect | Local (MongoDB Local) | Local (Atlas Dev) | Dev (Staging) | Production |
|--------|---|---|---|---|
| **Database** | Local machine | Cloud (Atlas) | Cloud (Atlas) | Cloud (Atlas) |
| **File** | `.env.local` | `.env.local` | `.env.dev` | Platform vars |
| **Internet** | ❌ Not needed | ✅ Required | ✅ Required | ✅ Required |
| **Branch** | N/A (local) | N/A (local) | `develop` | `main` |
| **URL** | localhost:3000 | localhost:3000 | dev.recleaguenation.com* | recleaguenation.com |
| **Commit to git** | ❌ No | ❌ No | ❌ No | N/A |
| **Status** | ✅ Active | ✅ Active | ✅ Active | ✅ Active |
| **Use case** | Developer testing | Team testing | Team staging | Live users |

*The dev site is available at `https://dev.recleaguenation.com`.

---

## Learn More

- [Local Setup Guide](./LOCAL_SETUP.md) - Step-by-step setup for new developers
- [NPM Scripts Reference](./NPM_SCRIPTS.md) - All available npm commands
- [Deployment Guide](./DEPLOYMENT.md) - Deploying to Render and Netlify
- [Security Best Practices](./SECURITY.md) - Security recommendations
- [Main README](../README.md) - Project overview
