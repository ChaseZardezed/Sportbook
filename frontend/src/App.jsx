import MatchupTable from './components/MatchupTable'
import BetSlip from './components/BetSlip'
import Sidebar from './components/Sidebar'
import { useSportFilter } from './store/sportFilter'

function App() {
  const selectedSport = useSportFilter((state) => state.selectedSport)

  return (
    <div className="grid min-h-screen grid-cols-[224px_1fr_320px] gap-4 bg-gray-950 p-6">
      <Sidebar />
      <div>
        <h1 className="mb-4 text-xl font-bold text-white">{selectedSport ?? 'All Sports'}</h1>
        <MatchupTable />
      </div>
      <BetSlip />
    </div>
  )
}

export default App
