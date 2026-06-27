import MatchupTable from '../components/MatchupTable'
import GameChat from '../components/GameChat'
import BetSlip from '../components/BetSlip'
import Ticker from '../components/Ticker'
import PromoBanner from '../components/PromoBanner'
import SportTabs from '../components/SportTabs'
import { useSportFilter } from '../store/sportFilter'
import { useGameChat } from '../store/gameChat'
import { useBetSlip } from '../store/betSlip'

export default function HomePage() {
  const selectedSport = useSportFilter((state) => state.selectedSport)
  const isChatOpen = useGameChat((state) => state.openMatch !== null)
  const isBetSlipOpen = useBetSlip((state) => state.isOpen)

  let gridColsClass = 'grid-cols-[1fr]'
  if (isChatOpen && isBetSlipOpen) gridColsClass = 'grid-cols-[320px_1fr_320px]'
  else if (isChatOpen) gridColsClass = 'grid-cols-[320px_1fr]'
  else if (isBetSlipOpen) gridColsClass = 'grid-cols-[1fr_320px]'

  return (
    <>
      <Ticker />
      <PromoBanner />
      <div className="px-6 pt-4">
        <SportTabs />
      </div>
      <div className={`grid gap-4 p-6 ${gridColsClass}`}>
        {isChatOpen && <GameChat />}
        <div>
          <h1 className="mb-4 text-xl font-bold text-white">{selectedSport ?? 'All Sports'}</h1>
          <MatchupTable />
        </div>
        {isBetSlipOpen && (
          <div className="sticky top-4 self-start">
            <BetSlip />
          </div>
        )}
      </div>
    </>
  )
}
