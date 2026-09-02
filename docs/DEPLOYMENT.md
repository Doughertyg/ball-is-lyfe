# Dev and Production Deployment

This project uses separate services for each hosted environment:

| Environment | Frontend | Backend | Database | Branch |
|---|---|---|---|---|
| Local | Local webpack server | Local Node server | Local MongoDB or dev Atlas | Any |
| Dev/staging | Separate Netlify site | Separate Render service | Dev Atlas cluster | `develop` |
| Production | Production Netlify site | Production Render service | Production Atlas cluster | `main` |

The dev URL and dev services may not exist yet. Use the generated Netlify and Render URLs until custom domains are configured.

## Why Separate Netlify Sites Work on the Free Plan

Netlify environment scopes are not required for this setup. Create two Netlify sites, then give each site its own build variables:

- Production site stores production frontend values.
- Dev site stores dev frontend values.

The values are injected when that site builds. Do not put secrets in Netlify variables: frontend variables are compiled into browser JavaScript and are public. `GOOGLE_CLIENT_ID` is an OAuth identifier, not a secret; client secrets must never be placed here.

## 1. Create the Dev Render Service

1. In Render, choose **New > Web Service**.
2. Connect the repository.
3. Select the `develop` branch.
4. Name the service something clear, such as `rec-league-nation-api-dev`.
5. Set the runtime to Node.
6. Set **Build Command** to `npm ci`.
7. Set **Start Command** to `npm run start`.
8. Select Node 16 or newer. The repository currently declares Node 16.x.
9. Add the following environment variables:

```env
NODE_ENV=development
MONGODB=mongodb+srv://DEV_USER:DEV_PASSWORD@DEV_CLUSTER.mongodb.net/rec-league-nation-dev?retryWrites=true&w=majority
SECRET_KEY=<unique-dev-secret>
REFRESH_SECRET=<unique-dev-refresh-secret>
ORIGIN=https://YOUR_DEV_NETLIFY_SITE.netlify.app
GRAPHQL_ADDRESS=https://rec-league-nation-api-dev.onrender.com/graphql
GOOGLE_CLIENT_ID=<dev-google-client-id>
LOG_LEVEL=info
```

Use the exact `.onrender.com` hostname Render gives the service. `PORT` is normally supplied by Render; only set it if the service requires it.

10. Deploy the service and open its GraphQL URL. Save the final URL for the Netlify setup.

## 2. Create the Dev Netlify Site

1. In Netlify, choose **Add new site > Import an existing project**.
2. Select the same repository.
3. Set the production branch for this site to `develop`.
4. Set **Build command** to `npm run build`.
5. Set **Publish directory** to `public`.
6. Use a name such as `rec-league-nation-dev`.
7. Add these site-level environment variables under **Project configuration > Environment variables**:

```env
NODE_ENV=development
GRAPHQL_ADDRESS=https://rec-league-nation-api-dev.onrender.com/graphql
GOOGLE_CLIENT_ID=<dev-google-client-id>
```

8. Trigger a deploy. The dev frontend must use the Render dev URL, never the production API URL.
9. Copy the Netlify URL and update the Render service's `ORIGIN` variable with it. Redeploy Render after changing it.

The frontend now reads one explicit `GRAPHQL_ADDRESS` for both Apollo requests and authentication. Include `/graphql` exactly once.

## 3. Configure a Custom Dev Domain Later

A custom domain is optional. You can test with `YOUR_SITE.netlify.app` first.

When ready:

1. In the dev Netlify site, open **Domain management**.
2. Add `dev.recleaguenation.com`.
3. Follow Netlify's DNS instructions.
4. Change Render's `ORIGIN` to `https://dev.recleaguenation.com`.
5. Redeploy the Render service.
6. Update Netlify's `GRAPHQL_ADDRESS` only if the API also receives a custom domain.

Until this is complete, document the generated Netlify hostname as the dev URL. Do not advertise `dev.recleaguenation.com` as active before DNS and TLS work.

## 4. Configure Google OAuth Separately

Google OAuth client IDs are public identifiers, but Google restricts where they may be used.

Create separate OAuth web clients when possible:

- Dev client: used only by the dev Netlify site
- Prod client: used only by the production Netlify site

For the dev client in Google Cloud Console, add the dev frontend origin under **Authorized JavaScript origins**:

```text
https://YOUR_DEV_NETLIFY_SITE.netlify.app
```

When the custom domain exists, add:

```text
https://dev.recleaguenation.com
```

For production, the production client should include:

```text
https://recleaguenation.com
```

Do not put a Google client secret in the frontend, Netlify, or this repository.

## 5. Configure the Production Netlify Site

Leave the existing production site connected to `main`. Its site-level variables should be:

```env
NODE_ENV=production
GRAPHQL_ADDRESS=https://YOUR_PRODUCTION_API_HOST/graphql
GOOGLE_CLIENT_ID=<prod-google-client-id>
```

The production site must point to the production Render service and use the production Google client ID. Changing these variables requires a new Netlify build.

## 6. Configure the Production Render Service

The production Render service should remain connected to `main` and use:

```env
NODE_ENV=production
MONGODB=mongodb+srv://PROD_USER:PROD_PASSWORD@PROD_CLUSTER.mongodb.net/rec-league-nation-prod?retryWrites=true&w=majority
SECRET_KEY=<unique-prod-secret>
REFRESH_SECRET=<unique-prod-refresh-secret>
ORIGIN=https://recleaguenation.com
GRAPHQL_ADDRESS=https://YOUR_PRODUCTION_API_HOST/graphql
GOOGLE_CLIENT_ID=<prod-google-client-id>
LOG_LEVEL=warn
```

Use a production-only Atlas database user and credentials. Never reuse the dev Atlas user or JWT secrets.

## 7. Deployment Verification

Test dev before merging to `main`:

- Dev Netlify site loads.
- Browser network requests go to the dev Render GraphQL URL.
- Google login uses the dev OAuth client.
- Creating test data changes only the dev Atlas database.
- Render logs show the expected `development` environment.
- Production frontend still points to production API.
- Production database and OAuth credentials were not changed.

## Important Build Prerequisite

The project requires Node 16.x or newer. The current build environment used Node `v10.15.1`, which causes Tailwind CSS to fail because it relies on `String.prototype.matchAll`. Upgrade local Node and pin the hosted build runtime to Node 16 or newer before diagnosing further deployment failures.

For local setup, use a version manager such as `nvm`, then run:

```bash
nvm install 16
nvm use 16
npm ci
npm run build
```
