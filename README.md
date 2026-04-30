# LaLiga Dashboard 2025/26

  A live LaLiga stats dashboard built with React, Vite, and shadcn/ui. Pulls real data from the [football-data.org](https://www.football-data.org) API.

  ![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
  ![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)
  ![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-black?logo=shadcnui&logoColor=white)

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
  | Components | shadcn/ui |
  | Icons | Lucide React |
  | Charts | Chart.js 4 |
  | Data | football-data.org API v4 |

  ## Project Structure

  src/
  ├── api/
  │   └── football.js          # fetch, transform, cache
  ├── components/
  │   ├── ui/                  # shadcn/ui (Button, Card, Badge, Input…)
  │   ├── layout/
  │   │   ├── Sidebar.jsx
  │   │   └── Topbar.jsx       # search + theme toggle
  │   ├── charts/
  │   │   └── ChartCard.jsx
  │   └── shared/
  │       ├── StatCard.jsx
  │       ├── TeamBadge.jsx
  │       ├── FormDots.jsx
  │       └── SectionHeader.jsx
  ├── hooks/
  │   └── useTheme.js          # dark/light toggle
  ├── pages/
  │   ├── Dashboard.jsx
  │   ├── Standings.jsx
  │   ├── Teams.jsx
  │   ├── Scorers.jsx
  │   ├── Statistics.jsx
  │   ├── TeamDetail.jsx
  │   └── PlayerDetail.jsx
  ├── lib/
  │   └── utils.js             # cn() helper
  ├── App.jsx                  # router + global state
  └── main.jsx

  ## Getting Started

  ### 1. Get a free API key

  Register at [football-data.org](https://www.football-data.org/client/register) and copy your token.

  ### 2. Add your API key

  Open `server.cjs` and replace the value:

  ```js
  const API_KEY = 'YOUR_API_KEY_HERE';

  3. Install dependencies

  npm install

  4. Run the app

  Open two terminals in the project folder:

  # Terminal 1 — API proxy server
  npm run server

  # Terminal 2 — React dev server
  npm run dev

  Then open http://localhost:5173.

  ▎ The proxy server is required because football-data.org blocks direct browser requests. If port 3000 is already in use, run kill $(lsof -t -i:3000) first.

  Available Scripts

  ┌─────────────────┬──────────────────────────────┐
  │     Command     │         Description          │
  ├─────────────────┼──────────────────────────────┤
  │ npm run dev     │ Start Vite dev server        │
  ├─────────────────┼──────────────────────────────┤
  │ npm run build   │ Production build             │
  ├─────────────────┼──────────────────────────────┤
  │ npm run preview │ Preview production build     │
  ├─────────────────┼──────────────────────────────┤
  │ npm run server  │ Start API proxy on port 3000 │
  └─────────────────┴──────────────────────────────┘

  API & Rate Limiting

  The free tier of football-data.org allows 10 requests per minute. The proxy queues requests with an 800 ms delay between them and caches responses in memory to avoid hitting the limit
  on repeat navigation.
  ```
