# Todo App (Server-backed with Cloudflare KV)

A full-stack todo application with a React frontend and Cloudflare Workers + KV backend.

## Architecture

- **Frontend**: React 18 + Vite
- **Backend**: Cloudflare Worker with KV storage
- **API**: RESTful endpoints for CRUD operations

## Features

- ✅ Create, read, update, delete todos
- ✅ Mark todos as complete/incomplete
- ✅ Priority levels (low, medium, high)
- ✅ Filter by status (all, active, completed)
- ✅ Optimistic UI updates
- ✅ Server-side persistence with Cloudflare KV
- ✅ Responsive design

## Project Structure

```
todo/
├── worker/
│   └── index.js              # Cloudflare Worker API
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── api/              # API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── wrangler.example.toml     # Worker config
```

## Getting Started

### 1. Setup Cloudflare KV

```bash
# Create KV namespace
wrangler kv:namespace create "TODOS"

# Copy the namespace ID to wrangler.toml
```

### 2. Deploy Worker API

```bash
cd todo
cp wrangler.example.toml wrangler.toml
# Edit wrangler.toml with your KV namespace ID

# Deploy
wrangler publish
```

### 3. Run Frontend

```bash
cd frontend
npm install

# Development (proxies API to localhost:8787)
npm run dev

# Or set API URL for deployed worker
# Create .env.local:
# VITE_API_URL=https://your-worker.workers.dev/api

npm run dev
```

### 4. Build for Production

```bash
npm run build
# Output in dist/
```

## API Endpoints

### GET /api/todos
List all todos
- Query params: `?completed=true|false`, `?limit=N`
- Returns: `Todo[]`

### POST /api/todos
Create todo
- Body: `{ text: string, priority?: string, due?: string }`
- Returns: `Todo`

### GET /api/todos/:id
Get single todo
- Returns: `Todo`

### PUT /api/todos/:id
Update todo
- Body: `{ text?, completed?, priority?, due? }`
- Returns: `Todo`

### DELETE /api/todos/:id
Delete todo
- Returns: `{ success: true, id }`

## Todo Schema

```typescript
{
  id: string
  text: string
  completed: boolean
  createdAt: string (ISO)
  updatedAt: string (ISO)
  priority: 'low' | 'medium' | 'high'
  due: string | null
}
```

## KV Storage

- `todo:{id}` → Todo JSON
- `todos:ids` → Array of todo IDs

## Local Development

Run Worker locally:
```bash
wrangler dev --local
```

Run frontend with proxy:
```bash
cd frontend
npm run dev
```

The Vite dev server proxies `/api/*` to `http://localhost:8787`.

## Technologies

- React 18
- Vite 5
- Cloudflare Workers
- Cloudflare KV
- Fetch API
