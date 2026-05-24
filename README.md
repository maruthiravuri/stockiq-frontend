# StockIQ Frontend

React 18 + TypeScript + Vite + MUI v9 · Real-time stock & ETF research platform

## Quick start — local demo

**Prerequisites:** Node 18+, Docker Desktop running

### Step 1 — Start the backend
```bash
cd ../stockiq-backend
docker compose up --build
# Wait ~60s for all services to be healthy
# Postgres: 5432 | Redis: 6379 | Auth: 8081 | Market: 8082 | Portfolio: 8083 | Gateway: 8080
```

### Step 2 — Start the frontend
```bash
npm install --legacy-peer-deps
npm start
# Opens http://localhost:5173 (Vite dev server)
```

### Step 3 — Sign in
Default credentials: **admin / Admin@123**

Or create a new account on the register tab.

---

## Architecture

```
Frontend (Vite:5173)
    ↓ REST + WebSocket
API Gateway (:8080)
    ├── /api/v1/auth/**     → Auth Service (:8081)
    ├── /api/v1/market/**   → Market Data Service (:8082)
    ├── /api/v1/portfolio/** → Portfolio Service (:8083)
    └── /ws/**              → WebSocket (live quotes)
```

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8080` | API Gateway base URL |
| `VITE_WS_URL` | `http://localhost:8082/ws/quotes` | WebSocket URL |

Create `.env.local` to override:
```
VITE_API_URL=http://localhost:8080
VITE_WS_URL=http://localhost:8082/ws/quotes
```

## Features

- 10 research tabs (Mag7, SP100, Value, Buffett, AI, Metals, Crypto, Screener)
- Portfolio management — add/edit/delete holdings, P&L, allocation charts, CSV export
- Multiple watchlists with price alerts
- Full-text security search
- Custom screener with filter builder
- Dark/light theme, collapsible sidebar
- Real WebSocket for live quotes (when backend running)
- Graceful fallback to demo data when backend offline
