import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import TopNav from './components/TopNav'
import HomePage from './pages/HomePage'
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

function RequireAuth({ children }) {
  const user = useCurrentUser((state) => state.user)
  if (!user) return <Navigate to="/login" replace />
  return children
}

function RedirectIfAuthed({ children }) {
  const user = useCurrentUser((state) => state.user)
  if (user) return <Navigate to="/" replace />
  return children
}

function useHydrateUserData() {
  const userId = useCurrentUser((state) => state.user?.id)
  const setBalance = useBalance((state) => state.setBalance)
  const loadCollection = useTcgCollection((state) => state.loadCollection)
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
    loadPlacedBets(userId)
    loadUnopenedPacks(userId)
  }, [
    userId,
    setBalance,
    loadCollection,
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
        <Route
          path="/*"
          element={
            <RequireAuth>
              <div className="min-h-screen bg-white dark:bg-gray-950">
                <TopNav />
                <Routes>
                  <Route path="/" element={<HomePage />} />
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
