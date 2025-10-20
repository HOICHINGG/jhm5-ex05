# HKDSE Results Analyzer

Analyze 2024 HKDSE results statistics (Table 3F) with Cloudflare D1, Worker API, and React frontend with charts.

## Features

- ✅ Import CSV data into D1 (SQLite)
- ✅ REST API for querying statistics
- ✅ Interactive charts with Chart.js
- ✅ Table view with sortable columns
- ✅ Filter by data type (Number/Percentage)
- ✅ Responsive design

## Project Structure

```
hkdse/
├── worker/
│   └── index.js              # Cloudflare Worker API
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main React app
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── scripts/
│   ├── import.js             # CSV to SQL converter
│   └── package.json
├── schema.sql                # D1 database schema
└── wrangler.example.toml
```

## Setup

### 1. Create D1 Database

```bash
wrangler d1 create hkdse
# Copy the database_id to wrangler.toml
```

### 2. Initialize Schema

```bash
wrangler d1 execute hkdse --file=./schema.sql
```

### 3. Import CSV Data

```bash
cd scripts
npm install
node import.js ../../data/2024_HKDSE_results_statistics_table3f_en.csv

# This generates seed.sql
# Import to D1:
wrangler d1 execute hkdse --file=./seed.sql
```

### 4. Deploy Worker

```bash
cp wrangler.example.toml wrangler.toml
# Edit wrangler.toml with your database_id

wrangler publish
```

### 5. Run Frontend

```bash
cd frontend
npm install

# Development
npm run dev

# Production build
npm run build
```

## API Endpoints

### GET /api/stats
Get statistics with filtering
- Query params: `?type=Number|Percentage`, `?description=text`
- Returns: Array of result rows

### GET /api/rows
Get paginated rows
- Query params: `?limit=N`, `?offset=N`, `?type=Number|Percentage`
- Returns: Array of rows

### GET /api/descriptions
Get unique descriptions
- Returns: Array of description strings

## Database Schema

```sql
results (
  id INTEGER PRIMARY KEY,
  row_number INTEGER,
  description TEXT,
  type TEXT,
  day_school_number INTEGER,
  day_school_cumulative INTEGER,
  all_candidates_number INTEGER,
  all_candidates_cumulative INTEGER
)
```

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
- Chart.js + react-chartjs-2
- Vite 5
- Cloudflare Workers
- Cloudflare D1 (SQLite)
- csv-parse

## Data Source

2024 HKDSE Results Statistics - Table 3F (English)
Provided in `/data/2024_HKDSE_results_statistics_table3f_en.csv`
