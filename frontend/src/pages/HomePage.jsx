import MatchupTable from '../components/MatchupTable'
import GameChat from '../components/GameChat'
import StatsPanel from '../components/StatsPanel'
import BetSlip from '../components/BetSlip'
import Ticker from '../components/Ticker'
import PromoBanner from '../components/PromoBanner'
import SportTabs from '../components/SportTabs'
import { useSportFilter } from '../store/sportFilter'
import { useGameChat } from '../store/gameChat'
import { useStatsPanel } from '../store/statsPanel'
import { useBetSlip } from '../store/betSlip'

export default function HomePage() {
  const selectedSport = useSportFilter((state) => state.selectedSport)
  const isChatOpen = useGameChat((state) => state.openMatch !== null)
  const isStatsOpen = useStatsPanel((state) => state.openMatch !== null)
  const isLeftPanelOpen = isChatOpen || isStatsOpen
  const isBetSlipOpen = useBetSlip((state) => state.isOpen)
  const toggleBetSlipOpen = useBetSlip((state) => state.toggleOpen)
  const selectionCount = useBetSlip((state) => Object.keys(state.selections).length)

  let gridColsClass = 'grid-cols-[1fr]'
  if (isLeftPanelOpen && isBetSlipOpen) gridColsClass = 'grid-cols-[320px_1fr_320px]'
  else if (isLeftPanelOpen) gridColsClass = 'grid-cols-[320px_1fr]'
  else if (isBetSlipOpen) gridColsClass = 'grid-cols-[1fr_320px]'

  return (
    <>
      <Ticker />
      <PromoBanner />
      <div className="flex items-center justify-between border-b border-gray-200 px-6 pt-4 pb-3 dark:border-gray-800">
        <SportTabs />
        <button
          type="button"
          onClick={toggleBetSlipOpen}
          className={`flex items-center gap-2 rounded border px-4 py-1.5 text-sm font-semibold ${
            isBetSlipOpen
              ? 'border-purple-500 bg-purple-600/20 text-gray-900 dark:text-white'
              : 'border-gray-300 text-gray-600 hover:border-purple-500 dark:border-gray-700 dark:text-gray-300'
          }`}
        >
          {isBetSlipOpen ? 'Close' : 'Bet Slip'}
          {selectionCount > 0 && (
            <span className="rounded-full bg-purple-600 px-1.5 text-xs text-white">{selectionCount}</span>
          )}
        </button>
      </div>
      <div className={`grid gap-4 p-6 ${gridColsClass}`}>
        {isChatOpen && <GameChat />}
        {isStatsOpen && <StatsPanel />}
        <div>
          <h1 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">{selectedSport ?? 'All Sports'}</h1>
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
