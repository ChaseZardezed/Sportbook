import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TopNav from './components/TopNav'
import HomePage from './pages/HomePage'
import GamePage from './pages/GamePage'
import TcgPage from './pages/TcgPage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950">
        <TopNav />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game/:matchId" element={<GamePage />} />
          <Route path="/tcg" element={<TcgPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
