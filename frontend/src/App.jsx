import MatchupTable from './components/MatchupTable'
import BetSlip from './components/BetSlip'
import Sidebar from './components/Sidebar'
import TopNav from './components/TopNav'
import Ticker from './components/Ticker'
import { useSportFilter } from './store/sportFilter'
import { useBetSlip } from './store/betSlip'

function App() {
  const selectedSport = useSportFilter((state) => state.selectedSport)
  const isBetSlipOpen = useBetSlip((state) => state.isOpen)

  return (
    <div className="min-h-screen bg-gray-950">
      <TopNav />
      <Ticker />
      <div
        className={`grid gap-4 p-6 ${
          isBetSlipOpen ? 'grid-cols-[224px_1fr_320px]' : 'grid-cols-[224px_1fr]'
        }`}
      >
        <Sidebar />
        <div>
          <h1 className="mb-4 text-xl font-bold text-white">{selectedSport ?? 'All Sports'}</h1>
          <MatchupTable />
        </div>
        {isBetSlipOpen && <BetSlip />}
      </div>
    </div>
  )
}

export default App
