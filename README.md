# Cooli Demo — Monorepo

A simple task manager monorepo for testing [Coolify](https://coolify.io/) deployments.

## Structure

```
cooli-demo/
├── backend/      # Express API (Node.js)
├── frontend/     # Next.js app
└── docker-compose.yml
```

## Local Development

```bash
npm install
npm run dev        # starts both backend (:3001) and frontend (:3000)
```

## Deploy to Coolify

### Option A: Docker Compose (recommended)
1. Push this repo to GitHub/GitLab
2. In Coolify, create a new service → **Docker Compose**
3. Point it to this repo — Coolify will use `docker-compose.yml`
4. Set `NEXT_PUBLIC_API_URL` env variable to your backend's public URL

### Option B: Separate services
1. Create two resources in Coolify:
   - **Backend** — Dockerfile, base directory: `/backend`, port `3001`
   - **Frontend** — Dockerfile, base directory: `/frontend`, port `3000`
2. Set `NEXT_PUBLIC_API_URL` on the frontend to the backend's URL

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/tasks` | List all tasks |
| POST | `/api/tasks` | Create a task |
| PATCH | `/api/tasks/:id` | Toggle completion |
| DELETE | `/api/tasks/:id` | Delete a task |
