# Dev and Production Workflow

This project uses separate services for each hosted environment:

| Environment | Frontend | Backend | Database | Branch |
|---|---|---|---|---|
| Local | Local webpack server | Local Node server | Local MongoDB or dev Atlas | Any |
| Dev/staging | Separate Netlify site | Separate Render service | Dev Atlas cluster | `develop` |
| Production | Production Netlify site | Production Render service | Production Atlas cluster | `main` |

The hosted infrastructure is already configured for this project. Developers do not need to create Netlify, Render, MongoDB Atlas, or Google Cloud resources.

## Developer Workflow

The dev and production sites are separate Netlify projects, so each site has its own build variables:

- Production site stores production frontend values.
- Dev site stores dev frontend values and deploys `develop`.

The values are injected when that site builds. Do not put secrets in Netlify variables: frontend variables are compiled into browser JavaScript and are public. `GOOGLE_CLIENT_ID` is an OAuth identifier, not a secret; client secrets must never be placed here. Shared credentials are provided through the team's approved secret-sharing process.

1. Create a feature branch from `develop`.
2. Make and test changes locally.
3. Open a pull request targeting `develop`.
4. After merging, test the deployed change at `https://dev.recleaguenation.com`.
5. After verification, merge `develop` into `main` for production deployment.

Do not commit environment files or production data. Do not point local work at the production database.

## Hosted Environment Rules

- Dev Netlify uses the dev Render GraphQL endpoint and dev Google client ID.
- Production Netlify uses the production Render GraphQL endpoint and production Google client ID.
- Dev Render uses the dev Atlas database and dev JWT secrets.
- Production Render uses the production Atlas database and production JWT secrets.
- `GRAPHQL_ADDRESS` must contain the complete endpoint, including `/graphql`, exactly once.
- Frontend variables are public after the bundle is built. Never put database credentials, JWT secrets, or OAuth client secrets in Netlify variables.

## Checking a Dev Deployment

Before merging to `main`, verify:

- `https://dev.recleaguenation.com` loads successfully.
- Browser requests go to the dev Render GraphQL endpoint.
- Google login uses the dev OAuth client.
- Test data changes only the dev Atlas database.
- Production URLs and data remain unchanged.

## Important Build Prerequisite

The project requires Node 16.x or newer. The current build environment used Node `v10.15.1`, which causes Tailwind CSS to fail because it relies on `String.prototype.matchAll`. Upgrade local Node and pin the hosted build runtime to Node 16 or newer before diagnosing further deployment failures.

For local setup, use a version manager such as `nvm`, then run:

```bash
nvm install 16
nvm use 16
npm ci
npm run build
```
