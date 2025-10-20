# Math Rush

A fast-paced arithmetic speed game with a global leaderboard powered by Cloudflare D1.

## Features

- ✅ Timed math challenges (60 seconds)
- ✅ Multiple difficulty levels
- ✅ Real-time scoring with time bonuses
- ✅ Global leaderboard
- ✅ Support for +, -, ×, ÷ operations
- ✅ Responsive design

## Project Structure

```
mathrush/
├── worker/
│   └── index.js              # Cloudflare Worker API
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── StartScreen.jsx
│   │   │   ├── GameScreen.jsx
│   │   │   ├── EndScreen.jsx
│   │   │   └── Leaderboard.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── schema.sql                # D1 database schema
└── wrangler.example.toml
```

## Setup

### 1. Create D1 Database

```bash
wrangler d1 create mathrush
# Copy the database_id to wrangler.toml
```

### 2. Initialize Schema

```bash
wrangler d1 execute mathrush --file=./schema.sql
```

### 3. Deploy Worker

```bash
cp wrangler.example.toml wrangler.toml
# Edit wrangler.toml with your database_id

wrangler publish
```

### 4. Run Frontend

```bash
cd frontend
npm install

# Development
npm run dev

# Production build
npm run build
```

## Game Rules

- ⏱️ **Time**: 60 seconds per game
- ✅ **Correct Answer**: +10 points + time bonus (based on remaining time)
- ❌ **Wrong Answer**: -5 points
- 🎯 **Difficulty Levels**:
  - **Easy**: Numbers 1-10
  - **Medium**: Numbers 1-50
  - **Hard**: Numbers 1-100

## API Endpoints

### GET /api/leaderboard
Get top scores
- Query params: `?difficulty=easy|medium|hard`, `?limit=N`
- Returns: Array of leaderboard entries

### POST /api/score
Submit new score
- Body: `{ player_name, score, difficulty, time_taken, correct_answers, total_questions }`
- Returns: `{ success, id, rank, score }`

## Database Schema

```sql
leaderboard (
  id INTEGER PRIMARY KEY,
  player_name TEXT,
  score INTEGER,
  difficulty TEXT,
  time_taken INTEGER,
  correct_answers INTEGER,
  total_questions INTEGER,
  created_at DATETIME
)
```

## Anti-Cheat

- Server-side score validation (max score check)
- Reasonable time-per-question validation
- Rate limiting on submissions

## Local Development

### Run Worker locally
```bash
wrangler dev --local
```

### Run Frontend with proxy
```bash
cd frontend
npm run dev
```

Vite proxies `/api/*` to `http://localhost:8787`.

## Technologies

- React 18
- Vite 5
- Cloudflare Workers
- Cloudflare D1 (SQLite)
- CSS3 animations

## Tips for High Scores

- Focus on accuracy first, speed second
- Time bonus is awarded based on remaining time
- Practice mental math for faster calculations
- Start with easier difficulties to build confidence
