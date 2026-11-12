# Aryan Jaiswal — Portfolio

A dark, red-accented portfolio for AI/ML engineering work. The client is a React 18, TypeScript, and Vite application; the API is an Express and MongoDB service. Public pages use generated local data if the API is unavailable.

## Requirements

- Node.js 20.19+ or 22.12+ and npm (required by Vite 8)
- MongoDB connection string (Atlas or local)

## Local setup

1. Copy `server/.env.example` to `server/.env` and set the private server values. Keep secrets only in that file.
2. Install the workspace dependencies:

   ```powershell
   npm install
   ```

3. Generate client modules from the source-of-truth YAML:

   ```powershell
   npm run generate:site
   ```

4. Seed portfolio records and create the initial admin account if it does not exist:

   ```powershell
   npm run seed
   ```

   Seeding upserts configured records; it does not delete database entries or replace an existing administrator password.

5. Start the Vite client and API together:

   ```powershell
   npm run dev
   ```

   The site runs at `http://localhost:5173`, and the API runs at `http://localhost:5000`. Vite proxies `/api` requests to the API.

6. Open `/admin` to manage projects, skills, posts, experience, and education.

## Environment

`server/.env.example` lists the supported server variables. Important values:

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | At least 32 characters; signs the administrator session |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Initial administrator credentials, used by `npm run seed` |
| `CLIENT_URL` | Allowed client origin(s), comma-separated |
| `GITHUB_USERNAME` | Public GitHub account used by the cached repository endpoint |
| `GITHUB_TOKEN` | Optional server-only token to increase GitHub API limits |

`client/.env.example` documents the optional `VITE_API_URL`. Do not put credentials in any `VITE_*` variable; Vite exposes those values to browsers. In local development, leave it set to `/api`.

The portfolio provides direct WhatsApp and email links. It does not collect or send contact messages through the server.

## Content updates

Edit `portfolio-config.yaml`, then run `npm run generate:site`. This creates `client/src/config/site.js` and the local fallback data modules under `client/src/data/`. Public modules deliberately exclude `referenceWebsite` and source-only asset paths. The admin dashboard manages the database copy; syncing database edits back to the YAML file is a manual content-maintenance step.

Project images and the resume are served from `client/public/assets/`. `ProjectArtwork` draws a project-specific graphic when no image is configured.

## Checks

```powershell
npm run typecheck
npm run lint
npm test
npm run build
```

`npm run check` runs generation, type checking, linting, server unit tests, and the production client build.

## Deployment

### MongoDB Atlas

1. Create a database and a least-privilege database user.
2. Configure Atlas Network Access for the hosting provider; avoid broad public access where provider networking permits a narrower rule.
3. Use the Atlas URI as the server's `MONGODB_URI`.

### API on Render or Railway

Deploy the repository root as a Node service. Install with `npm install`; use `npm run start --workspace server` as the start command. Set the server environment variables from `server/.env.example` in the provider's secret environment panel, including:

- `NODE_ENV=production`, `PORT` (if required by the provider), `MONGODB_URI`
- a long random `JWT_SECRET`, `JWT_EXPIRES_IN`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
- `CLIENT_URL` to the deployed client origin
- `GITHUB_USERNAME` and, optionally, `GITHUB_TOKEN`

Run `npm run seed` from the repository root once the API environment and MongoDB are available. Do not copy `.env` files into deployment artifacts.

### Client on Vercel

1. Import the repository and set the project root to `client/`.
2. Use `npm run build` as the build command and `dist` as the output directory.
3. Add `VITE_API_URL` as a Vercel environment variable, set to the deployed API base including `/api` (for example, `https://your-api.example/api`).
4. Set the API's `CLIENT_URL` to the deployed Vercel origin. If using a custom domain, use that exact origin.

Vite's development proxy is not used in production. Admin authentication uses an HTTP-only cookie; production requests must use HTTPS and the API must allow the exact client origin.

## Routes

- `GET /api/projects`, `/api/skills`, `/api/experience`, `/api/posts`
- `GET /api/github/repos` (server-side cache)
- `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`
- `GET`, `POST`, `PUT`, `DELETE /api/admin/:resource` (authenticated)
- `GET /api/health`

The admin resources are `projects`, `skills`, `experience`, and `posts`. Credentials and password hashes are never sent to client modules.
