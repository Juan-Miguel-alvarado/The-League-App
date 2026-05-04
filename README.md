# LaLiga Dashboard 2025/26

A live LaLiga stats dashboard built with React and Vite. Pulls real data from the [football-data.org](https://www.football-data.org) API.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-deployed-00C7B7?logo=netlify&logoColor=white)

<img width="1366" height="768" alt="League" src="https://github.com/user-attachments/assets/dd6227de-7320-4725-80b1-beb19e4b915e" />


## Live Demo

[thlg.netlify.app](https://thlg.netlify.app)

## Features

- **Dashboard** — key stats, standings preview, top scorers, recent results, and 3 charts
- **Standings** — full table with UCL / relegation zone indicators
- **Teams** — card grid with crest, form dots, and click-through to team detail
- **Top Scorers** — table + horizontal bar chart with goals & assists
- **Statistics** — attack vs defense, goals per team, points-per-game charts
- **Team Detail** — radar chart, form strip, and squad scorers
- **Player Detail** — radar vs field average, contribution donut chart
- **Search** — instant fuzzy search for teams and players
- **Dark / Light mode** — toggle in the topbar, persisted in localStorage

## Tech Stack

| Layer | Library |
|-------|---------|
| Framework | React 18 |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Icons | Lucide React |
| Charts | Chart.js 4 |
| Data | football-data.org API v4 |
| Deployment | Netlify (with serverless functions) |

## Getting Started

### 1. Get a free API key

Register at [football-data.org](https://www.football-data.org/client/register) and copy your token.

### 2. Add your token

Replace the token in two files:

**`vite.config.js`** (used in local dev via Vite proxy):
```js
proxyReq.setHeader('X-Auth-Token', 'YOUR_TOKEN_HERE')
```

**`netlify/functions/api.js`** (used in production via Netlify function):
```js
const API_KEY = 'YOUR_TOKEN_HERE'
```

### 3. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). No extra server needed.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |

## Architecture

```
Browser → /api/*
  └── Local dev:   Vite proxy → football-data.org (token injected server-side)
  └── Production:  Netlify redirect → Netlify Function → football-data.org
```

The API token is never exposed to the browser. In local dev the Vite proxy injects it; in production a Netlify serverless function handles the request.

## Rate Limiting

The free tier of football-data.org allows 10 requests per minute. The app queues requests with an 800 ms delay between them and caches responses in memory to avoid hitting the limit on repeat navigation.
