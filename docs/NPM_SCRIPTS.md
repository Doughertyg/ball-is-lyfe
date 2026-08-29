# 📦 NPM Scripts Reference

Quick reference for all available npm scripts in the Ball is Lyfe project.

## Development Scripts

### `npm run start-dev`

**Purpose:** Start the backend GraphQL server with auto-reload

```bash
npm run start-dev
```

- Watches for file changes
- Auto-restarts server when you save
- Uses `.env.local` configuration
- Server runs on `http://localhost:3000`
- GraphQL at `http://localhost:3000/graphql`

**Best for:** Backend development

---

### `npm run start`

**Purpose:** Start the backend server in production mode

```bash
npm run start
```

- Single run (no auto-reload)
- Uses production configuration
- Used by Heroku for deployment
- Connects to production database

**Best for:** Production deployment

---

### `npm run serve`

**Purpose:** Start frontend dev server with hot reload

```bash
npm run serve
```

- Webpack dev server with hot module replacement
- Automatically reloads when you save
- Runs on `http://localhost:3000`
- Connects to local backend (or configured API)

**Best for:** Frontend development

---

### `npm run dev`

**Purpose:** Watch and rebuild frontend with Webpack

```bash
npm run dev
```

- Watches for changes in `app/` folder
- Rebuilds bundle on every save
- Creates sourcemaps for debugging
- Output goes to `public/bundle.js`

**Best for:** Frontend development (alternative to `npm run serve`)

---

### `npm run tailwind`

**Purpose:** Watch and compile Tailwind CSS

```bash
npm run tailwind
```

- Watches for CSS changes
- Compiles Tailwind styles
- Auto-rebuilds on save
- Output goes to `public/output.css`

**Best for:** Styling and CSS development (run in separate terminal)

---

## Build Scripts

### `npm run build`

**Purpose:** Build frontend for production

```bash
npm run build
```

- Optimized, minified bundle
- Removes sourcemaps (smaller file size)
- Creates `public/bundle.js`
- Ready for deployment

**Best for:** Production builds, Netlify deployment

---

## Code Quality Scripts

### `npm run pretty`

**Purpose:** Format code with Prettier

```bash
npm run pretty
```

- Automatically formats all code
- Enforces consistent style
- Applies to `.js`, `.jsx`, `.json`, `.css` files

**Best for:** Before committing code

---

## Quick Start Commands

### Full Development Setup

```bash
# Terminal 1: Backend
npm run start-dev

# Terminal 2: Frontend
npm run serve

# Terminal 3: CSS (optional, but recommended)
npm run tailwind
```

All three running together = full development environment.

---

### Building for Production

```bash
# Build frontend
npm run build

# Then push to production
git push heroku main    # If using Heroku
```

---

## What Each Script Does

| Script | Command | Purpose | Best Used For |
|--------|---------|---------|---------------|
| `npm run start-dev` | `NODE_ENV=development nodemon server/index` | Auto-reloading backend | Backend development |
| `npm run start` | `node server/index` | Production backend | Live deployment |
| `npm run serve` | `webpack-dev-server --mode development` | Frontend with hot reload | Frontend development |
| `npm run tailwind` | `tailwindcss --watch` | Watch CSS files | Styling work |
| `npm run dev` | `webpack --watch --devtool source-map` | Webpack watch mode | Frontend building |
| `npm run build` | `webpack --mode production` | Production bundle | Deployment |
| `npm run pretty` | `prettier . -w` | Format code | Before commits |

---

## Useful Combinations

### Frontend Only Development

```bash
# Terminal 1
npm run serve

# Terminal 2 (optional - only if working on styles)
npm run tailwind
```

Requires backend running or a deployed backend URL.

---

### Full Local Development

```bash
# Terminal 1
npm run start-dev

# Terminal 2
npm run serve

# Terminal 3 (optional)
npm run tailwind
```

Complete local environment with all services running.

---

### Building for Deployment

```bash
# Format code
npm run pretty

# Build frontend
npm run build

# Commit and push
git add .
git commit -m "Build for production"
git push origin main
```

---

## Troubleshooting Scripts

### Script command not found

```bash
# Make sure dependencies are installed
npm install

# Clear npm cache
npm cache clean --force
npm install
```

### Port already in use

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or change port
PORT=3001 npm run start-dev
```

### Webpack won't rebuild

```bash
# Increase file watcher limit (macOS/Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p

# Or restart the watcher
# Ctrl+C to stop, then run again
npm run dev
```

---

## See Also

- [Local Setup Guide](./LOCAL_SETUP.md) - Step-by-step setup for new developers
- [Environment Guide](./ENVIRONMENTS.md) - Managing different environments
- [README.md](../README.md) - Project overview and available scripts

---

**Pro Tip:** Bookmark this page! You'll reference it often. 📌
