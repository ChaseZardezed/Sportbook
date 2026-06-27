import MatchupTable from './components/MatchupTable'
import BetSlip from './components/BetSlip'
import GameChat from './components/GameChat'
import TopNav from './components/TopNav'
import Ticker from './components/Ticker'
import SportTabs from './components/SportTabs'
import { useSportFilter } from './store/sportFilter'
import { useBetSlip } from './store/betSlip'
import { useGameChat } from './store/gameChat'

function App() {
  const selectedSport = useSportFilter((state) => state.selectedSport)
  const isBetSlipOpen = useBetSlip((state) => state.isOpen)
  const isChatOpen = useGameChat((state) => state.openMatch !== null)

  let gridColsClass = 'grid-cols-[1fr]'
  if (isChatOpen && isBetSlipOpen) gridColsClass = 'grid-cols-[320px_1fr_320px]'
  else if (isChatOpen) gridColsClass = 'grid-cols-[320px_1fr]'
  else if (isBetSlipOpen) gridColsClass = 'grid-cols-[1fr_320px]'

  return (
    <div className="min-h-screen bg-gray-950">
      <TopNav />
      <Ticker />
      <div className="px-6 pt-4">
        <SportTabs />
      </div>
      <div className={`grid gap-4 p-6 ${gridColsClass}`}>
        {isChatOpen && <GameChat />}
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
