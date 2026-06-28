import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import TopNav from './components/TopNav'
import HomePage from './pages/HomePage'
import SportsPage from './pages/SportsPage'
import GamePage from './pages/GamePage'
import TcgPage from './pages/TcgPage'
import LandingPage from './pages/LandingPage'
import CreateAccountPage from './pages/CreateAccountPage'
import { useCurrentUser } from './store/currentUser'
import { useBalance } from './store/balance'
import { useTcgCollection } from './store/tcgCollection'
import { usePlacedBets } from './store/placedBets'
import { useUnopenedPacks } from './store/unopenedPacks'
import { fetchUser } from './api/client'

// Gates the whole app shell (everything under "/*") behind login. Reads
// from useCurrentUser's localStorage-backed state, which is populated
// synchronously at module load (see store/currentUser.js), so there's no
// flash of protected content before redirecting on a hard refresh.
function RequireAuth({ children }) {
  const user = useCurrentUser((state) => state.user)
  if (!user) return <Navigate to="/login" replace />
  return children
}

// Inverse guard for /login and /signup - bounces an already-authed user
// back to the dashboard instead of letting them re-see the login form.
function RedirectIfAuthed({ children }) {
  const user = useCurrentUser((state) => state.user)
  if (user) return <Navigate to="/" replace />
  return children
}

// Central hydration point for everything that's scoped per-user but lives
// in its own store (balance/collection/bets/unopened-packs). Runs whenever
// `user` changes - covers login, logout, AND a page refresh while already
// logged in (since `userId` differs from its initial undefined on mount).
// Note: balance is special-cased via a direct fetchUser call rather than
// going through useCurrentUser's stored snapshot, since that snapshot can
// be stale the moment balance changes after login.
function useHydrateUserData() {
  const userId = useCurrentUser((state) => state.user?.id)
  const setBalance = useBalance((state) => state.setBalance)
  const loadCollection = useTcgCollection((state) => state.loadCollection)
  const loadHistory = useTcgCollection((state) => state.loadHistory)
  const clearCollection = useTcgCollection((state) => state.clearCollection)
  const loadPlacedBets = usePlacedBets((state) => state.loadPlacedBets)
  const clearPlacedBets = usePlacedBets((state) => state.clearPlacedBets)
  const loadUnopenedPacks = useUnopenedPacks((state) => state.loadUnopenedPacks)
  const clearUnopenedPacks = useUnopenedPacks((state) => state.clearUnopenedPacks)

  useEffect(() => {
    if (!userId) {
      setBalance(0)
      clearCollection()
      clearPlacedBets()
      clearUnopenedPacks()
      return
    }

    fetchUser(userId)
      .then((user) => setBalance(user.balance))
      .catch((error) => console.error('Failed to load balance:', error))
    loadCollection(userId)
    loadHistory(userId)
    loadPlacedBets(userId)
    loadUnopenedPacks(userId)
  }, [
    userId,
    setBalance,
    loadCollection,
    loadHistory,
    clearCollection,
    loadPlacedBets,
    clearPlacedBets,
    loadUnopenedPacks,
    clearUnopenedPacks,
  ])
}

function App() {
  useHydrateUserData()

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <RedirectIfAuthed>
              <LandingPage />
            </RedirectIfAuthed>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectIfAuthed>
              <CreateAccountPage />
            </RedirectIfAuthed>
          }
        />
        {/*
          A single "/*" route wraps the entire logged-in app shell (nav +
          nested Routes) in one RequireAuth check, rather than wrapping each
          page route individually - so adding a new authenticated page below
          never risks forgetting the auth guard.
        */}
        <Route
          path="/*"
          element={
            <RequireAuth>
              <div className="min-h-screen bg-white dark:bg-gray-950">
                <TopNav />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/sports" element={<SportsPage />} />
                  <Route path="/game/:matchId" element={<GamePage />} />
                  <Route path="/tcg" element={<TcgPage />} />
                </Routes>
              </div>
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
