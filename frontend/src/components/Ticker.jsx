import { useMatches } from '../hooks/useMatches'

const MAX_FEATURED = 5

function TickerItem({ match }) {
  return (
    <div className="flex items-center gap-2 px-6 text-sm whitespace-nowrap">
      {match.is_live && (
        <span className="rounded bg-purple-600 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
          Live
        </span>
      )}
      <span className="text-gray-600 dark:text-gray-300">
        {match.away_team} vs {match.home_team}
      </span>
      {match.is_live && (
        <span className="font-semibold text-gray-900 dark:text-white">
          {match.away_score} - {match.home_score}
        </span>
      )}
    </div>
  )
}

// Each lap renders the featured games exactly once, padded with an invisible
// spacer so the lap is always at least one viewport wide. Two identical laps
// sit side by side and the track scrolls left by exactly one lap's width
// (-50%), so it loops with no gap and no game repeated within a lap.
function TickerLap({ matches }) {
  return (
    <div className="flex shrink-0" style={{ minWidth: '100vw' }}>
      {matches.map((match) => (
        <TickerItem key={match.id} match={match} />
      ))}
    </div>
  )
}

export default function Ticker() {
  const { data: matches } = useMatches()
  const featuredMatches = (matches ?? [])
    .filter((match) => match.is_featured && match.is_live)
    .slice(0, MAX_FEATURED)

  if (featuredMatches.length === 0) return null

  return (
    <div className="overflow-hidden border-b border-gray-300 bg-white py-2 dark:border-gray-800 dark:bg-gray-950">
      <div className="flex w-max animate-ticker">
        <TickerLap matches={featuredMatches} />
        <TickerLap matches={featuredMatches} />
      </div>
    </div>
  )
}
