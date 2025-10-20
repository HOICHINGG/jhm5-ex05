# jhm5-ex05 - Six Web Applications

A collection of six web applications demonstrating various technologies including Cloudflare Workers, KV, D1, React, and vanilla JavaScript.

## 📦 Apps Overview

### 1. Landing Page (Cloudflare Worker)
A minimal landing page that links to all five applications, with health endpoint and optional visit counter.

**Tech**: Cloudflare Workers, KV (optional)  
**Location**: `/landing`

### 2. Tication - Vanilla (Client-side)
Classic Tic-Tac-Toe game built with pure HTML, CSS, and JavaScript.

**Tech**: HTML, CSS, JavaScript  
**Location**: `/tication-vanilla`

### 3. Tication - React (Client-side + localStorage)
Enhanced Tic-Tac-Toe with move history, undo/redo, and persistent state.

**Tech**: React 18, Vite, localStorage  
**Location**: `/tication-react`

### 4. Todo App (Server-backed with Cloudflare KV)
Full-stack todo application with REST API and React frontend.

**Tech**: React 18, Cloudflare Workers, KV  
**Location**: `/todo`

### 5. HKDSE Analyser (Cloudflare D1)
Analyze 2024 HKDSE results with interactive charts and table view.

**Tech**: React 18, Chart.js, Cloudflare Workers, D1  
**Location**: `/hkdse`

### 6. Math Rush (Game + Leaderboard)
Fast-paced arithmetic game with global leaderboard.

**Tech**: React 18, Cloudflare Workers, D1  
**Location**: `/mathrush`

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (for Workers/KV/D1)
- Cloudflare account (free tier works)

### Installation

```bash
# Clone the repository
git clone https://github.com/HOICHINGG/jhm5-ex05.git
cd jhm5-ex05

# Install dependencies for each React app
cd tication-react && npm install && cd ..
cd todo/frontend && npm install && cd ../..
cd hkdse/frontend && npm install && cd ../..
cd mathrush/frontend && npm install && cd ../..
```

## 📋 Setup Guide

### 1. Landing Page

```bash
cd landing
cp wrangler.example.toml wrangler.toml

# Optional: Create KV namespace for analytics
wrangler kv:namespace create "VISITS"
# Update wrangler.toml with the namespace ID

# Deploy
wrangler publish
```

### 2. Tication (Vanilla)

No setup needed - just open `tication-vanilla/index.html` in a browser!

```bash
# Or serve with a local server
cd tication-vanilla
python3 -m http.server 8000
# Visit http://localhost:8000
```

### 3. Tication (React)

```bash
cd tication-react
npm install
npm run dev
# Visit http://localhost:5173

# Build for production
npm run build
```

### 4. Todo App

```bash
# Setup KV namespace
wrangler kv:namespace create "TODOS"
# Update todo/wrangler.example.toml with namespace ID

cd todo
cp wrangler.example.toml wrangler.toml

# Deploy Worker
wrangler publish

# Run frontend
cd frontend
npm install
npm run dev
# Visit http://localhost:5173
```

### 5. HKDSE Analyser

```bash
# Create D1 database
wrangler d1 create hkdse
# Copy database_id to hkdse/wrangler.example.toml

cd hkdse
cp wrangler.example.toml wrangler.toml

# Initialize schema
wrangler d1 execute hkdse --file=./schema.sql

# Import CSV data
cd scripts
npm install
node import.js ../../data/2024_HKDSE_results_statistics_table3f_en.csv
wrangler d1 execute hkdse --file=./seed.sql
cd ..

# Deploy Worker
wrangler publish

# Run frontend
cd frontend
npm install
npm run dev
# Visit http://localhost:5173
```

### 6. Math Rush

```bash
# Create D1 database
wrangler d1 create mathrush
# Copy database_id to mathrush/wrangler.example.toml

cd mathrush
cp wrangler.example.toml wrangler.toml

# Initialize schema
wrangler d1 execute mathrush --file=./schema.sql

# Deploy Worker
wrangler publish

# Run frontend
cd frontend
npm install
npm run dev
# Visit http://localhost:5173
```

## 🏗️ Project Structure

```
jhm5-ex05/
├── README.md                          # This file
├── data/
│   └── 2024_HKDSE_results_statistics_table3f_en.csv
├── landing/                           # App 1: Landing page
│   ├── worker/
│   │   └── index.js
│   ├── static/
│   ├── wrangler.example.toml
│   └── README.md
├── tication-vanilla/                  # App 2: Vanilla Tic-Tac-Toe
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   └── README.md
├── tication-react/                    # App 3: React Tic-Tac-Toe
│   ├── src/
│   ├── package.json
│   └── README.md
├── todo/                              # App 4: Server-backed Todo
│   ├── worker/
│   ├── frontend/
│   ├── wrangler.example.toml
│   └── README.md
├── hkdse/                             # App 5: HKDSE Analyser
│   ├── worker/
│   ├── frontend/
│   ├── scripts/
│   ├── schema.sql
│   ├── wrangler.example.toml
│   └── README.md
└── mathrush/                          # App 6: Math Rush Game
    ├── worker/
    ├── frontend/
    ├── schema.sql
    ├── wrangler.example.toml
    └── README.md
```

## 🛠️ Technologies Used

### Frontend
- React 18
- Vite 5
- Chart.js (HKDSE Analyser)
- CSS3 (Grid, Flexbox, Animations)
- localStorage API
- Fetch API

### Backend
- Cloudflare Workers
- Cloudflare KV (Key-Value storage)
- Cloudflare D1 (SQLite database)
- REST APIs

### Tools
- Wrangler CLI
- csv-parse (for ETL)

## 📝 Development Tips

### Running Workers Locally

```bash
# Start Worker in dev mode with local D1/KV
wrangler dev --local

# Or connect to remote D1/KV
wrangler dev
```

### Building React Apps

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### CORS Configuration

All Worker APIs include CORS headers for local development. In production, update the `Access-Control-Allow-Origin` header to restrict origins.

## 🚢 Deployment

### Deploy All Workers

```bash
# Landing
cd landing && wrangler publish && cd ..

# Todo API
cd todo && wrangler publish && cd ..

# HKDSE API
cd hkdse && wrangler publish && cd ..

# Math Rush API
cd mathrush && wrangler publish && cd ..
```

### Deploy React Apps

Option 1: Build and serve from Cloudflare Pages
```bash
cd <app>/frontend
npm run build
# Upload dist/ folder to Cloudflare Pages
```

Option 2: Serve static files from Workers  
Option 3: Use any static host (Vercel, Netlify, etc.)

## 🎯 Features Checklist

- [x] Landing page with app links and health endpoint
- [x] Vanilla Tic-Tac-Toe with accessibility
- [x] React Tic-Tac-Toe with undo/redo and persistence
- [x] Server-backed Todo with CRUD and optimistic UI
- [x] HKDSE analyser with charts and CSV import
- [x] Math Rush game with leaderboard and anti-cheat

## 🔒 Security Notes

- KV/D1 bindings are secure (not exposed to client)
- Consider adding authentication for production todo/leaderboard APIs
- Rate limiting recommended for public APIs
- Input validation implemented on all endpoints

## 📄 License

MIT License

## 🤝 Contributing

Each app is self-contained. See individual README files for details.

---

**Built with ❤️ using Cloudflare Workers, React, and modern web technologies**