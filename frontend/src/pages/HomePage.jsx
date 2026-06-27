import MatchupTable from '../components/MatchupTable'
import GameChat from '../components/GameChat'
import Ticker from '../components/Ticker'
import PromoBanner from '../components/PromoBanner'
import SportTabs from '../components/SportTabs'
import { useSportFilter } from '../store/sportFilter'
import { useGameChat } from '../store/gameChat'

export default function HomePage() {
  const selectedSport = useSportFilter((state) => state.selectedSport)
  const isChatOpen = useGameChat((state) => state.openMatch !== null)

  return (
    <>
      <Ticker />
      <PromoBanner />
      <div className="px-6 pt-4">
        <SportTabs />
      </div>
      <div className={`grid gap-4 p-6 ${isChatOpen ? 'grid-cols-[320px_1fr]' : 'grid-cols-[1fr]'}`}>
        {isChatOpen && <GameChat />}
        <div>
          <h1 className="mb-4 text-xl font-bold text-white">{selectedSport ?? 'All Sports'}</h1>
          <MatchupTable />
        </div>
      </div>
    </>
  )
}
