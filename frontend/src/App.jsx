import MatchupTable from './components/MatchupTable'
import BetSlip from './components/BetSlip'

function App() {
  return (
    <div className="grid min-h-screen grid-cols-[1fr_320px] gap-4 bg-gray-950 p-6">
      <div>
        <h1 className="mb-4 text-xl font-bold text-white">NFL</h1>
        <MatchupTable />
      </div>
      <BetSlip />
    </div>
  )
}

export default App
