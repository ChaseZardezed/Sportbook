import { useMatches } from '../hooks/useMatches'
import { useSportFilter } from '../store/sportFilter'

const SPORT_ICONS = {
  NFL: '🏈',
  NBA: '🏀',
  MLB: '⚾',
  Soccer: '⚽',
  Tennis: '🎾',
  NHL: '🏒',
}

function buildSportCounts(matches) {
  const counts = new Map()
  for (const match of matches) {
    counts.set(match.sport, (counts.get(match.sport) || 0) + 1)
  }
  return counts
}

export default function SportTabs() {
  const { data: matches } = useMatches()
  const selectedSport = useSportFilter((state) => state.selectedSport)
  const selectSport = useSportFilter((state) => state.selectSport)

  const sportCounts = buildSportCounts(matches ?? [])

  return (
    <div className="flex items-center gap-2 border-b border-gray-200 px-1 pb-3 dark:border-gray-800">
      <button
        type="button"
        onClick={() => selectSport(null)}
        className={`rounded px-3 py-1.5 text-sm font-semibold ${
          selectedSport === null
            ? 'bg-purple-600 text-white'
            : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        All ({matches?.length ?? 0})
      </button>
      {[...sportCounts.entries()].map(([sport, count]) => (
        <button
          key={sport}
          type="button"
          onClick={() => selectSport(sport)}
          className={`rounded px-3 py-1.5 text-sm font-semibold ${
            selectedSport === sport
              ? 'bg-purple-600 text-white'
              : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          {SPORT_ICONS[sport] && <span className="mr-1">{SPORT_ICONS[sport]}</span>}
          {sport} ({count})
        </button>
      ))}
    </div>
  )
}
