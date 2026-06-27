import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BetSlip from './components/BetSlip'
import TopNav from './components/TopNav'
import HomePage from './pages/HomePage'
import GamePage from './pages/GamePage'
import { useBetSlip } from './store/betSlip'

function App() {
  const isBetSlipOpen = useBetSlip((state) => state.isOpen)

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950">
        <TopNav />
        <div className={`grid gap-4 ${isBetSlipOpen ? 'grid-cols-[1fr_320px]' : 'grid-cols-[1fr]'}`}>
          <div className="min-w-0">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/game/:matchId" element={<GamePage />} />
            </Routes>
          </div>
          {isBetSlipOpen && (
            <div className="p-6">
              <BetSlip />
            </div>
          )}
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
