# 🏀 Ball is Lyfe - Rec League Nation

A full-stack web application for creating and managing recreational sports leagues, tracking stats, recording game results, and sharing them with your community.

**Live App**: https://RecLeagueNation.com/

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **Apollo Client** - GraphQL client
- **Tailwind CSS** - Utility-first CSS framework (primary styling)
- **Styled Components** - CSS-in-JS (legacy, being phased out)
- **Webpack** - Module bundler
- **Babel** - JavaScript transpiler

### Backend
- **Node.js** - Runtime environment
- **Apollo Server** - GraphQL server
- **Express** - HTTP server framework
- **MongoDB** - Database (local or team-managed Atlas)
- **JWT** - Authentication

### Hosting & Deployment
- **Netlify** - Frontend hosting
- **Render** - Backend hosting

---

## 📋 Prerequisites

Before getting started, ensure you have:

- **Node.js** 16.x or higher ([Download](https://nodejs.org/))
- **npm** 7.x or higher (comes with Node.js)
- **Git** for version control
- Access to the team's shared dev environment credentials

### Verify Installation

```bash
node --version    # Should be v16.x or higher
npm --version     # Should be 7.x or higher
git --version     # Any recent version
```

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ball-is-lyfe.git
cd ball-is-lyfe
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file and update it with your configuration:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual values (see [Environment Configuration](#-environment-configuration) section below).

### 4. Start Development Servers

In separate terminal windows:

**Terminal 1 - Start the backend (GraphQL server)**
```bash
npm run start-dev
```

**Terminal 2 - Start the frontend development server**
```bash
npm run serve
```

**Terminal 3 - Watch for CSS changes (Tailwind)**
```bash
npm run tailwind
```

The app will be available at `http://localhost:3000`

---

## 🔧 Environment Configuration

This project supports three environments:

| Environment | Purpose | Status | Database |
|---|---|---|---|
| **local** | Your computer | ✅ Active | Local MongoDB OR team dev cluster |
| **dev** | Staging/Testing | ✅ Active | Team dev MongoDB Atlas cluster |
| **production** | Live app | ✅ Active | Production MongoDB cluster |

### Environment Files

- **`.env.local`** - Your local development environment (git-ignored, never commit)
- **`.env.dev`** - Dev/staging reference (git-ignored, never commit; hosted values are managed by Render)
- **`.env.example`** - Template with all required variables
- **Production** - Set environment variables in your hosting platform (Render for backend, Netlify for frontend)

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development`, `local`, `production` |
| `PORT` | Backend server port | `3000` |
| `MONGODB` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `SECRET_KEY` | JWT secret for access tokens | Generate with: `openssl rand -hex 32` |
| `REFRESH_SECRET` | JWT secret for refresh tokens | Generate with: `openssl rand -hex 32` |
| `ORIGIN` | CORS origin (where requests come from) | `http://localhost:3000` |
| `GRAPHQL_ADDRESS` | GraphQL endpoint URL | `http://localhost:3000/graphql` |
| `GOOGLE_CLIENT_ID` | Google OAuth ID (optional) | From Google Cloud Console |
| `LOG_LEVEL` | Logging level | `error`, `warn`, `info`, `debug` |

### Generate Secret Keys

Generate random secret keys for JWT tokens:

```bash
# Generate SECRET_KEY
openssl rand -hex 32

# Generate REFRESH_SECRET
openssl rand -hex 32
```

### Local Development (.env.local)

```env
NODE_ENV=local
PORT=3000
MONGODB=mongodb+srv://dev-user:dev-password@cluster0.mongodb.net/ball-is-lyfe-dev?retryWrites=true&w=majority
SECRET_KEY=your-generated-secret-key-here
REFRESH_SECRET=your-generated-refresh-secret-key-here
ORIGIN=http://localhost:3000
GRAPHQL_ADDRESS=http://localhost:3000/graphql
GOOGLE_CLIENT_ID=
LOG_LEVEL=debug
```

### MongoDB Options for Local Development

For local development, you have multiple options:

#### Option A: Local MongoDB (Recommended for Offline Development)

Run MongoDB on your machine for completely offline development:

```env
MONGODB=mongodb://localhost:27017/ball-is-lyfe-dev
```

**Setup:** See [Local MongoDB Setup](#local-mongodb-setup-optional) below.

#### Option B: Team Dev MongoDB Cluster

Once the dev environment is set up, use the shared dev cluster:

```env
MONGODB=mongodb+srv://dev-user:dev-password@cluster-dev.mongodb.net/ball-is-lyfe-dev?retryWrites=true&w=majority
```

Use the team-provided dev connection string when you need shared staging data. Do not create a personal Atlas account or cluster for this project.

#### Option C: Production MongoDB (⚠️ Not Recommended for Local Dev)

Generally not recommended unless debugging production issues:

```env
MONGODB=mongodb+srv://prod-user:prod-password@cluster-prod.mongodb.net/ball-is-lyfe?retryWrites=true&w=majority
```

### Production Environment

Production configuration is already managed by the project administrators in Render and Netlify. Developers should not create or change production credentials. The deployed services use:

**Render (Backend):**
- `NODE_ENV=production`
- `MONGODB=` (production Atlas cluster)
- `SECRET_KEY=` (production secret)
- `REFRESH_SECRET=` (production secret)
- `ORIGIN=https://recleaguenation.com`
- `GRAPHQL_ADDRESS=https://recleaguenation.com/graphql`
- `GOOGLE_CLIENT_ID=` (production OAuth client)
- `LOG_LEVEL=warn`

**Netlify (Frontend):**
- `GRAPHQL_ADDRESS=https://recleaguenation.com/graphql`
- `GOOGLE_CLIENT_ID=` (production OAuth client)

---

## 📚 Available Scripts

### Local Development

```bash
# Start backend server with auto-reload
npm run start-dev

# Start frontend dev server with hot reload
npm run serve

# Watch and compile Tailwind CSS
npm run tailwind

# Watch and build frontend with Webpack
npm run dev
```

### Production

```bash
# Build frontend for production
npm run build

# Start backend server (production mode)
npm run start
```

### Code Quality

```bash
# Format code with Prettier
npm run pretty

# Run ESLint (if configured)
npm run lint
```

---

## 🏗️ Project Structure

```
ball-is-lyfe/
├── app/                    # React frontend application
│   ├── components/         # Reusable React components
│   ├── context/            # React context for state management
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── styled-components/  # Styled component definitions
│   ├── util/               # Utility functions
│   ├── config.js           # Frontend configuration
│   ├── ApolloProvider.js   # Apollo GraphQL setup
│   ├── App.jsx             # Main App component
│   └── index.jsx           # React entry point
│
├── server/                 # Node.js/Express backend
│   └── index.js            # Server entry point
│
├── graphql/                # GraphQL schema and resolvers
│   ├── resolvers/          # GraphQL resolver functions
│   ├── queries/            # GraphQL query definitions
│   ├── mutations/          # GraphQL mutation definitions
│   ├── subscriptions/      # GraphQL subscription definitions
│   └── typeDefs.js         # GraphQL type definitions
│
├── db/                     # Database models and setup
│   ├── models/             # Mongoose model definitions
│   └── schema.sql          # Database schema
│
├── public/                 # Built frontend (generated)
│   └── bundle.js           # Webpack bundle
│
├── config/                 # Centralized configuration
│   ├── index.js            # Config exports
│   └── env.js              # Environment variable loading
│
├── util/                   # Shared utility functions
│
├── .env.example            # Environment variable template
├── .env.local              # Local development env (git-ignored)
├── .env.dev                # Dev server env (git-ignored)
├── .gitignore              # Git ignore rules
├── webpack.config.js       # Webpack configuration
├── package.json            # Project dependencies
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── babel.config.js         # Babel transpiler configuration
├── .eslintrc.js            # ESLint configuration
└── README.md              # This file
```

---

## 🔐 Security Best Practices

### Environment Variables

1. **Never commit `.env` files** - They're in `.gitignore` for a reason
2. **Use `.env.example`** - This is the template; commit this instead
3. **Generate unique secrets** - Don't reuse the same secret across environments
4. **Rotate secrets regularly** - Especially if compromised
5. **Use strong passwords** - For database and service accounts

### Authentication

- JWTs are signed with `SECRET_KEY` and `REFRESH_SECRET`
- Access tokens should be short-lived (recommended: 15-60 minutes)
- Refresh tokens can be longer-lived (recommended: 7 days)
- Never expose secrets in browser console or network requests

### Database

- MongoDB connection uses SSL/TLS encryption
- Whitelist IP addresses in MongoDB Atlas
- Use strong database user passwords
- Regularly backup your database

---

## 🐛 Troubleshooting

### "Cannot find module 'config'"

The config module isn't being loaded properly. Ensure you're requiring from the correct path:

```javascript
const config = require('../config');  // From server/index.js
```

### "Missing required environment variable: MONGODB"

1. Check your `.env.local` file has `MONGODB` set
2. Verify the connection string format is correct
3. Check your MongoDB Atlas IP whitelist

### "Port 3000 already in use"

Either:
- Kill the process using port 3000: `lsof -ti:3000 | xargs kill -9`
- Or change the PORT in your `.env.local`

### "GraphQL endpoint not found"

Make sure:
1. Backend server is running (`npm run start-dev`)
2. `GRAPHQL_ADDRESS` is correctly set in `.env.local`
3. Check browser DevTools Network tab to see actual request URL

### "Database connection failed"

1. Verify `MONGODB` connection string is correct
2. Check MongoDB Atlas IP whitelist includes your computer
3. Ensure database user credentials are correct
4. Check network connectivity to MongoDB

---

## �️ Local MongoDB Setup (Optional)

For completely offline development, you can run MongoDB locally without needing internet connection or Atlas account.

### Install MongoDB Locally

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

**Manual Install:** Follow [MongoDB Community Edition Installation Guide](https://docs.mongodb.com/manual/installation/)

### Verify MongoDB is Running

```bash
# Should show running MongoDB version
mongo --version

# Try to connect
mongo mongodb://localhost:27017
```

### Update .env.local

```env
MONGODB=mongodb://localhost:27017/ball-is-lyfe-dev
```

Now you can develop completely offline without MongoDB Atlas!

---

## 📖 Additional Documentation

- [Local Setup Guide](./docs/LOCAL_SETUP.md) - Step-by-step setup for new developers
- [Environment Configuration](./docs/ENVIRONMENTS.md) - Managing local, dev, and production environments
- [Database Seeding](./docs/DATABASE_SEEDING.md) - Populating MongoDB with test data
- [NPM Scripts Reference](./docs/NPM_SCRIPTS.md) - All available npm commands
- [Google OAuth Setup](./docs/GOOGLE_AUTH_SETUP.md) - How to configure Google authentication
- [Deployment Guide](./docs/DEPLOYMENT.md) - Deploying to Render and Netlify
- [API Documentation](./docs/API.md) - GraphQL schema and API reference
- [Database Schema](./docs/DATABASE.md) - MongoDB collection structure

---

## 🤝 Contributing

1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Run code formatter: `npm run pretty`
4. Commit your changes: `git commit -m "Add your message here"`
5. Push to your branch: `git push origin feature/your-feature-name`
6. Open a Pull Request

### Code Style

- Use Prettier for code formatting
- Follow ESLint rules
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components focused and reusable

---

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 🙋 Getting Help

- **Issues**: GitHub Issues for bug reports and feature requests
- **Discussions**: GitHub Discussions for questions and ideas
- **Email**: contact@recleaguenation.com

---

## 🎯 Next Steps

After setting up your local environment:

1. **Explore the codebase** - Start with `app/App.jsx` and `server/index.js`
2. **Check GraphQL schema** - See `graphql/typeDefs.js` to understand available queries/mutations
3. **Look at a feature** - Find a component in `app/pages/` and trace through the code
4. **Run tests** - (Add tests as needed)
5. **Make a change** - Start with a small bug fix or feature

Happy coding! ⚽


