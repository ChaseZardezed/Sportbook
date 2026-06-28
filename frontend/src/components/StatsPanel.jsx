import { useMatches } from '../hooks/useMatches'
import { useStatsPanel } from '../store/statsPanel'

const MOCK_STATS = [
  { label: 'Points Per Game', away: '24.8', home: '27.1' },
  { label: 'Win %', away: '58%', home: '64%' },
  { label: 'Last 5', away: '3-2', home: '4-1' },
  { label: 'Head-to-Head', away: '2-3', home: '3-2' },
]

export default function StatsPanel() {
  const openMatch = useStatsPanel((state) => state.openMatch)
  const closeStats = useStatsPanel((state) => state.closeStats)
  const { data: matches } = useMatches()

  if (!openMatch) return null

  const match = matches?.find((m) => m.id === openMatch.matchId)

  return (
    <div className="flex flex-col rounded-lg border border-gray-300 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="flex items-center justify-between border-b border-gray-300 px-4 py-3 dark:border-gray-800">
        <div>
          <p className="text-xs text-gray-500">Game Stats</p>
          <h2 className="font-bold text-gray-900 dark:text-white">{openMatch.matchup}</h2>
        </div>
        <button type="button" onClick={closeStats} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
          ✕
        </button>
      </div>

      <div className="p-3">
        <div className="mb-2 grid grid-cols-[1fr_auto_auto] gap-2 text-xs font-semibold uppercase text-gray-500">
          <span></span>
          <span className="w-14 text-center">{match ? match.away_team.split(' ').pop() : 'Away'}</span>
          <span className="w-14 text-center">{match ? match.home_team.split(' ').pop() : 'Home'}</span>
        </div>
        <div className="space-y-2">
          {MOCK_STATS.map((stat) => (
            <div key={stat.label} className="grid grid-cols-[1fr_auto_auto] items-center gap-2 text-sm">
              <span className="text-gray-400">{stat.label}</span>
              <span className="w-14 text-center font-semibold text-gray-900 dark:text-white">{stat.away}</span>
              <span className="w-14 text-center font-semibold text-gray-900 dark:text-white">{stat.home}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
