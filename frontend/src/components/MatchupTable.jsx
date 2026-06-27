import { useMatches } from '../hooks/useMatches'
import { findMarket, formatOdds } from '../lib/odds'
import { useBetSlip } from '../store/betSlip'
import { useSportFilter } from '../store/sportFilter'
import { useGameChat } from '../store/gameChat'

function OddsButton({ id, label, odds, onClick }) {
  const isSelected = useBetSlip((state) => Boolean(state.selections[id]))

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded border px-2 py-1.5 text-sm font-medium ${
        isSelected
          ? 'border-purple-500 bg-purple-600/20 text-white'
          : 'border-gray-700 bg-gray-900 text-gray-200 hover:border-purple-500 hover:text-white'
      }`}
    >
      {label ? `${label} (${formatOdds(odds)})` : formatOdds(odds)}
    </button>
  )
}

function MatchRow({ match }) {
  const toggleSelection = useBetSlip((state) => state.toggleSelection)
  const openChat = useGameChat((state) => state.openChat)
  const isChatOpen = useGameChat((state) => state.openMatch?.matchId === match.id)
  const moneyline = findMarket(match.markets, 'moneyline')
  const spread = findMarket(match.markets, 'spread')
  const total = findMarket(match.markets, 'total')

  const select = (marketType, side, label, odds) =>
    toggleSelection({
      id: `${match.id}-${marketType}-${side}`,
      matchId: match.id,
      matchup: `${match.away_team} @ ${match.home_team}`,
      marketType,
      label,
      odds,
    })

  return (
    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] items-center gap-3 border-b border-gray-800 px-4 py-3">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">{match.away_team}</span>
          {match.is_live && (
            <>
              <span className="rounded bg-purple-600 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                Live
              </span>
              <span className="rounded border border-purple-500 bg-purple-600/20 px-1.5 py-0.5 text-xs font-bold text-white">
                {match.away_score} - {match.home_score}
              </span>
            </>
          )}
        </div>
        <span className="font-semibold text-white">{match.home_team}</span>
      </div>

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

      <button
        type="button"
        aria-label="Open game chat"
        onClick={() =>
          openChat({ matchId: match.id, matchup: `${match.away_team} @ ${match.home_team}` })
        }
        className={`rounded border px-2 py-1.5 text-sm ${
          isChatOpen
            ? 'border-purple-500 bg-purple-600/20 text-white'
            : 'border-gray-700 text-gray-400 hover:border-purple-500 hover:text-white'
        }`}
      >
        💬
      </button>
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
    (a, b) => Number(b.is_live) - Number(a.is_live),
  )

  return (
    <div className="overflow-hidden rounded-lg border border-gray-800 bg-gray-950">
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 border-b border-gray-800 bg-gray-900 px-4 py-2 text-xs font-semibold uppercase text-gray-400">
        <span>Matchup</span>
        <span>Moneyline</span>
        <span>Spread</span>
        <span>Total</span>
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
