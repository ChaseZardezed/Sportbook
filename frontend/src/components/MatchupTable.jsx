import { Link } from 'react-router-dom'
import { useMatches } from '../hooks/useMatches'
import { findMarket } from '../lib/odds'
import { formatStartTime } from '../lib/time'
import { useBetSlip } from '../store/betSlip'
import { useSportFilter } from '../store/sportFilter'
import { useGameChat } from '../store/gameChat'
import { useStatsPanel } from '../store/statsPanel'
import OddsButton from './OddsButton'

function MatchRow({ match }) {
  const toggleSelection = useBetSlip((state) => state.toggleSelection)
  const toggleChat = useGameChat((state) => state.toggleChat)
  const isChatOpen = useGameChat((state) => state.openMatch?.matchId === match.id)
  const toggleStats = useStatsPanel((state) => state.toggleStats)
  const isStatsOpen = useStatsPanel((state) => state.openMatch?.matchId === match.id)
  const moneyline = findMarket(match.markets, 'moneyline')
  const spread = findMarket(match.markets, 'spread')
  const total = findMarket(match.markets, 'total')

  const select = (marketType, side, label, odds, line) =>
    toggleSelection({
      id: `${match.id}-${marketType}-${side}`,
      matchId: match.id,
      matchup: `${match.away_team} @ ${match.home_team}`,
      marketType,
      side,
      line,
      label,
      odds,
    })

  return (
    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_40px] items-center gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
      <Link to={`/game/${match.id}`} className="hover:opacity-80">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900 dark:text-white">{match.away_team}</span>
          {match.is_featured && (
            <span
              title="Featured"
              className="rounded border border-amber-500 bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-400"
            >
              ★ Featured
            </span>
          )}
          {match.is_live && (
            <>
              <span className="rounded bg-purple-600 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                Live
              </span>
              <span className="rounded border border-purple-500 bg-purple-600/20 px-1.5 py-0.5 text-xs font-bold text-gray-900 dark:text-white">
                {match.away_score} - {match.home_score}
              </span>
            </>
          )}
        </div>
        <span className="font-semibold text-gray-900 dark:text-white">@ {match.home_team}</span>
        <p className="mt-0.5 text-xs text-gray-500">
          {match.is_live ? match.clock : formatStartTime(match.start_time)}
        </p>
      </Link>

      <div className="flex flex-col gap-1">
        <OddsButton
          id={`${match.id}-moneyline-away`}
          label=""
          odds={moneyline.data.away}
          onClick={() => select('moneyline', 'away', `${match.away_team} ML`, moneyline.data.away)}
        />
        <OddsButton
          id={`${match.id}-moneyline-home`}
          label=""
          odds={moneyline.data.home}
          onClick={() => select('moneyline', 'home', `${match.home_team} ML`, moneyline.data.home)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <OddsButton
          id={`${match.id}-spread-away`}
          label={`${spread.data.away.line > 0 ? '+' : ''}${spread.data.away.line}`}
          odds={spread.data.away.odds}
          onClick={() =>
            select(
              'spread',
              'away',
              `${match.away_team} ${spread.data.away.line > 0 ? '+' : ''}${spread.data.away.line}`,
              spread.data.away.odds,
              spread.data.away.line,
            )
          }
        />
        <OddsButton
          id={`${match.id}-spread-home`}
          label={`${spread.data.home.line > 0 ? '+' : ''}${spread.data.home.line}`}
          odds={spread.data.home.odds}
          onClick={() =>
            select(
              'spread',
              'home',
              `${match.home_team} ${spread.data.home.line > 0 ? '+' : ''}${spread.data.home.line}`,
              spread.data.home.odds,
              spread.data.home.line,
            )
          }
        />
      </div>

      <div className="flex flex-col gap-1">
        <OddsButton
          id={`${match.id}-total-over`}
          label={`O ${total.data.line}`}
          odds={total.data.over}
          onClick={() => select('total', 'over', `Over ${total.data.line}`, total.data.over)}
        />
        <OddsButton
          id={`${match.id}-total-under`}
          label={`U ${total.data.line}`}
          odds={total.data.under}
          onClick={() => select('total', 'under', `Under ${total.data.line}`, total.data.under)}
        />
      </div>

      <div className="flex flex-col items-center gap-1">
        <button
          type="button"
          aria-label="Open game stats"
          onClick={() =>
            toggleStats({ matchId: match.id, matchup: `${match.away_team} @ ${match.home_team}` })
          }
          className={`flex h-9 w-9 items-center justify-center rounded border text-sm ${
            isStatsOpen
              ? 'border-purple-500 bg-purple-600/20 text-gray-900 dark:text-white'
              : 'border-gray-300 text-gray-400 hover:border-purple-500 hover:text-gray-900 dark:border-gray-700 dark:hover:text-white'
          }`}
        >
          ☰
        </button>
        <button
          type="button"
          aria-label="Open game chat"
          onClick={() =>
            toggleChat({ matchId: match.id, matchup: `${match.away_team} @ ${match.home_team}` })
          }
          className={`flex h-9 w-9 items-center justify-center rounded border text-sm ${
            isChatOpen
              ? 'border-purple-500 bg-purple-600/20 text-gray-900 dark:text-white'
              : 'border-gray-300 text-gray-400 hover:border-purple-500 hover:text-gray-900 dark:border-gray-700 dark:hover:text-white'
          }`}
        >
          💬
        </button>
      </div>
    </div>
  )
}

export default function MatchupTable() {
  const { data: matches, isLoading, error } = useMatches()
  const selectedSport = useSportFilter((state) => state.selectedSport)

  if (isLoading) return <p className="p-4 text-gray-400">Loading matches…</p>
  if (error) return <p className="p-4 text-red-400">Failed to load matches: {error.message}</p>

  const filteredMatches = selectedSport
    ? matches.filter((match) => match.sport === selectedSport)
    : matches
  const visibleMatches = [...filteredMatches].sort(
    (a, b) => Number(b.is_live) - Number(a.is_live) || Number(b.is_featured) - Number(a.is_featured),
  )

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_40px] gap-3 border-b border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold uppercase text-gray-400 dark:border-gray-800 dark:bg-gray-900">
        <span>Matchup</span>
        <span className="text-center">Moneyline</span>
        <span className="text-center">Spread</span>
        <span className="text-center">Total</span>
        <span></span>
      </div>
      {visibleMatches.length === 0 ? (
        <p className="p-4 text-sm text-gray-500">No matches for this sport yet.</p>
      ) : (
        visibleMatches.map((match) => <MatchRow key={match.id} match={match} />)
      )}
    </div>
  )
}
