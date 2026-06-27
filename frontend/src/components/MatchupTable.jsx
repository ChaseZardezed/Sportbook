import { useQuery } from '@tanstack/react-query'
import { fetchMatches } from '../api/client'
import { findMarket, formatOdds } from '../lib/odds'

function OddsButton({ children }) {
  return (
    <button
      type="button"
      className="w-full rounded border border-gray-700 bg-gray-900 px-2 py-1.5 text-sm font-medium text-gray-200 hover:border-purple-500 hover:text-white"
    >
      {children}
    </button>
  )
}

function MatchRow({ match }) {
  const moneyline = findMarket(match.markets, 'moneyline')
  const spread = findMarket(match.markets, 'spread')
  const total = findMarket(match.markets, 'total')

  return (
    <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-3 border-b border-gray-800 px-4 py-3">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">{match.away_team}</span>
          {match.is_live && (
            <span className="rounded bg-purple-600 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
              Live
            </span>
          )}
        </div>
        <span className="font-semibold text-white">{match.home_team}</span>
      </div>

      <div className="flex flex-col gap-1">
        <OddsButton>{formatOdds(moneyline.data.away)}</OddsButton>
        <OddsButton>{formatOdds(moneyline.data.home)}</OddsButton>
      </div>

      <div className="flex flex-col gap-1">
        <OddsButton>
          {spread.data.away.line > 0 ? '+' : ''}
          {spread.data.away.line} ({formatOdds(spread.data.away.odds)})
        </OddsButton>
        <OddsButton>
          {spread.data.home.line > 0 ? '+' : ''}
          {spread.data.home.line} ({formatOdds(spread.data.home.odds)})
        </OddsButton>
      </div>

      <div className="flex flex-col gap-1">
        <OddsButton>O {total.data.line} ({formatOdds(total.data.over)})</OddsButton>
        <OddsButton>U {total.data.line} ({formatOdds(total.data.under)})</OddsButton>
      </div>
    </div>
  )
}

export default function MatchupTable() {
  const { data: matches, isLoading, error } = useQuery({
    queryKey: ['matches'],
    queryFn: fetchMatches,
  })

  if (isLoading) return <p className="p-4 text-gray-400">Loading matches…</p>
  if (error) return <p className="p-4 text-red-400">Failed to load matches: {error.message}</p>

  return (
    <div className="overflow-hidden rounded-lg border border-gray-800 bg-gray-950">
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-3 border-b border-gray-800 bg-gray-900 px-4 py-2 text-xs font-semibold uppercase text-gray-400">
        <span>Matchup</span>
        <span>Moneyline</span>
        <span>Spread</span>
        <span>Total</span>
      </div>
      {matches.map((match) => (
        <MatchRow key={match.id} match={match} />
      ))}
    </div>
  )
}
