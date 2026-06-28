# StrikeBets

A simulated sportsbook + trading-card pack-opening web app. This is an entertainment/demo platform — no real money changes hands.

## What it does

- **Sportsbook**: live and upcoming games across NFL, NBA, MLB, Soccer, Tennis, and NHL, with moneyline/spread/total markets, player props, alt lines, and parlay support via a persistent bet slip.
- **TCG pack opening**: buy raw card packs (Bronze → Diamond tiers) across multiple categories (Pokémon, Basketball, Football, Baseball, Soccer, Women's Soccer), open them with an animated reveal, and either sell the pulled card for its market value or keep it in your collection.
- **Accounts**: real registration/login with bcrypt-hashed passwords. Balance, card collection, placed bets, and unopened packs are all persisted per-user in the database, not just in browser state.
- **Dashboard home page**: balance, active bets, collection value, live games, and recent pack-opening history at a glance.

## Tech stack

- **Backend**: FastAPI + SQLAlchemy (async) + SQLite, Pydantic v2 for request/response schemas, Passlib/bcrypt for password hashing.
- **Frontend**: React 19 + Vite, React Router, Zustand for state, TanStack Query for data fetching, Tailwind CSS v4.

## Project structure

backend/
  app/
    models.py          SQLAlchemy ORM models
    schemas.py         Pydantic request/response schemas
    routers/           FastAPI route handlers (auth, users, matches, packs)
    auth.py            Password hashing helpers
    database.py         Async engine/session setup
    seed.py            Demo data - matches, pack tiers, card pools
  brace.db             SQLite dev database (gitignored in spirit, but currently tracked)

frontend/
  src/
    pages/             Top-level routed pages (Home, Sports, TCG, Game, Landing, Create Account)
    components/        Shared UI (nav, bet slip, matchup table, TCG pack/collection UI)
    store/             Zustand stores (auth, balance, collection, placed bets, unopened packs, UI toggles)
    hooks/             TanStack Query hooks for matches/packs
    lib/               Pure helper functions (odds formatting, parlay math, rarity colors, RNG)
    api/client.js      Fetch wrappers for every backend endpoint

## Running locally

**Backend**:

python -m venv venv
venv\Scripts\activate          # or source venv/bin/activate on macOS/Linux
pip install -r requirements.txt
python -m app.seed             # populates a fresh brace.db with demo data
uvicorn app.main:app --reload --port 8000

**Frontend**:

npm install
npm run dev

The frontend expects the backend at http://localhost:8000 and runs on http://localhost:5173.

## Notes

- seed.py is **not idempotent** — re-running it against an existing database duplicates everything. It's meant for a fresh race.db; in-place schema or data changes against a live database with real accounts should be done as targeted SQL, not a reseed.
- There's no session/token-based auth on the API yet — user_id is passed directly in URLs. Fine for local/demo use, but would need real auth before being exposed publicly.
- Card artwork may be copyrighted (official trading card images) and is intentionally kept out of git history — see .gitignore. Card images live locally in rontend/public/cards/ and aren't tracked.
