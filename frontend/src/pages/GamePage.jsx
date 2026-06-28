import { Link, useParams } from 'react-router-dom'
import { useMatches } from '../hooks/useMatches'
import { useBetSlip } from '../store/betSlip'
import { useGameChat } from '../store/gameChat'
import OddsButton from '../components/OddsButton'
import Scoreboard from '../components/Scoreboard'
import BetSlip from '../components/BetSlip'
import GameChat from '../components/GameChat'
import { formatStartTime } from '../lib/time'

function GameLinesSection({ match, select }) {
  const moneyline = match.markets.find((m) => m.market_type === 'moneyline')
  const spread = match.markets.find((m) => m.market_type === 'spread')
  const total = match.markets.find((m) => m.market_type === 'total')

  if (!moneyline && !spread && !total) return null

  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold uppercase text-gray-400">Game Lines</h2>
      <div className="grid grid-cols-3 gap-3">
        {moneyline && (
          <div className="flex flex-col gap-1">
            <p className="text-center text-xs text-gray-500">Moneyline</p>
            <OddsButton
              id={`${match.id}-moneyline-away`}
              label={match.away_team}
              odds={moneyline.data.away}
              onClick={() => select('moneyline', 'away', `${match.away_team} ML`, moneyline.data.away)}
            />
            <OddsButton
              id={`${match.id}-moneyline-home`}
              label={match.home_team}
              odds={moneyline.data.home}
              onClick={() => select('moneyline', 'home', `${match.home_team} ML`, moneyline.data.home)}
            />
          </div>
        )}
        {spread && (
          <div className="flex flex-col gap-1">
            <p className="text-center text-xs text-gray-500">Spread</p>
            <OddsButton
              id={`${match.id}-spread-away`}
              label={`${match.away_team} ${spread.data.away.line > 0 ? '+' : ''}${spread.data.away.line}`}
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
              label={`${match.home_team} ${spread.data.home.line > 0 ? '+' : ''}${spread.data.home.line}`}
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
        )}
        {total && (
          <div className="flex flex-col gap-1">
            <p className="text-center text-xs text-gray-500">Total</p>
            <OddsButton
              id={`${match.id}-total-over`}
              label={`Over ${total.data.line}`}
              odds={total.data.over}
              onClick={() => select('total', 'over', `Over ${total.data.line}`, total.data.over)}
            />
            <OddsButton
              id={`${match.id}-total-under`}
              label={`Under ${total.data.line}`}
              odds={total.data.under}
              onClick={() => select('total', 'under', `Under ${total.data.line}`, total.data.under)}
            />
          </div>
        )}
      </div>
    </section>
  )
}

function AltLinesSection({ match, select }) {
  const altSpreads = match.markets.filter((m) => m.market_type === 'alt_spread')
  const altTotals = match.markets.filter((m) => m.market_type === 'alt_total')

  if (altSpreads.length === 0 && altTotals.length === 0) return null

  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold uppercase text-gray-400">Alternate Lines</h2>
      <div className="space-y-2">
        {altSpreads.map((market) => (
          <div key={market.id} className="grid grid-cols-2 gap-3">
            <OddsButton
              id={`alt-${market.id}-away`}
              label={`${match.away_team} ${market.data.away.line > 0 ? '+' : ''}${market.data.away.line}`}
              odds={market.data.away.odds}
              onClick={() =>
                select(
                  `alt-${market.id}`,
                  'away',
                  `${match.away_team} ${market.data.away.line > 0 ? '+' : ''}${market.data.away.line}`,
                  market.data.away.odds,
                )
              }
            />
            <OddsButton
              id={`alt-${market.id}-home`}
              label={`${match.home_team} ${market.data.home.line > 0 ? '+' : ''}${market.data.home.line}`}
              odds={market.data.home.odds}
              onClick={() =>
                select(
                  `alt-${market.id}`,
                  'home',
                  `${match.home_team} ${market.data.home.line > 0 ? '+' : ''}${market.data.home.line}`,
                  market.data.home.odds,
                )
              }
            />
          </div>
        ))}
        {altTotals.map((market) => (
          <div key={market.id} className="grid grid-cols-2 gap-3">
            <OddsButton
              id={`alt-${market.id}-over`}
              label={`Over ${market.data.line}`}
              odds={market.data.over}
              onClick={() => select(`alt-${market.id}`, 'over', `Over ${market.data.line}`, market.data.over)}
            />
            <OddsButton
              id={`alt-${market.id}-under`}
              label={`Under ${market.data.line}`}
              odds={market.data.under}
              onClick={() => select(`alt-${market.id}`, 'under', `Under ${market.data.line}`, market.data.under)}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

function NrfiSection({ match, select }) {
  const nrfi = match.markets.find((m) => m.market_type === 'nrfi')
  if (!nrfi) return null

  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold uppercase text-gray-400">No Run First Inning</h2>
      <div className="grid grid-cols-2 gap-3">
        <OddsButton
          id={`${match.id}-nrfi-yes`}
          label="Yes"
          odds={nrfi.data.yes}
          onClick={() => select('nrfi', 'yes', 'NRFI: Yes', nrfi.data.yes)}
        />
        <OddsButton
          id={`${match.id}-nrfi-no`}
          label="No"
          odds={nrfi.data.no}
          onClick={() => select('nrfi', 'no', 'NRFI: No', nrfi.data.no)}
        />
      </div>
    </section>
  )
}

function PlayerPropsSection({ match, select }) {
  const props = match.markets.filter((m) => m.market_type === 'player_prop')
  if (props.length === 0) return null

  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold uppercase text-gray-400">Player Props</h2>
      <div className="space-y-2">
        {props.map((market) => (
          <div key={market.id} className="rounded border border-gray-300 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
            <p className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
              {market.data.player} — {market.data.prop} ({market.data.line})
            </p>
            <div className="grid grid-cols-2 gap-3">
              <OddsButton
                id={`prop-${market.id}-over`}
                label={`Over ${market.data.line}`}
                odds={market.data.over}
                onClick={() =>
                  select(`prop-${market.id}`, 'over', `${market.data.player} Over ${market.data.line}`, market.data.over)
                }
              />
              <OddsButton
                id={`prop-${market.id}-under`}
                label={`Under ${market.data.line}`}
                odds={market.data.under}
                onClick={() =>
                  select(`prop-${market.id}`, 'under', `${market.data.player} Under ${market.data.line}`, market.data.under)
                }
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function GamePage() {
  const { matchId } = useParams()
  const { data: matches, isLoading, error } = useMatches()
  const toggleSelection = useBetSlip((state) => state.toggleSelection)
  const isBetSlipOpen = useBetSlip((state) => state.isOpen)
  const toggleBetSlipOpen = useBetSlip((state) => state.toggleOpen)
  const toggleChat = useGameChat((state) => state.toggleChat)
  const isChatOpen = useGameChat((state) => state.openMatch?.matchId === Number(matchId))

  if (isLoading) return <p className="p-6 text-gray-400">Loading game…</p>
  if (error) return <p className="p-6 text-red-400">Failed to load game: {error.message}</p>

  const match = matches.find((m) => String(m.id) === matchId)
  if (!match) return <p className="p-6 text-gray-400">Game not found.</p>

  const select = (groupKey, side, label, odds, line) =>
    toggleSelection({
      id: `${match.id}-${groupKey}-${side}`,
      matchId: match.id,
      matchup: `${match.away_team} @ ${match.home_team}`,
      marketType: groupKey,
      side,
      line,
      label,
      odds,
    })

  let gridColsClass = 'grid-cols-[1fr]'
  if (isChatOpen && isBetSlipOpen) gridColsClass = 'grid-cols-[320px_1fr_320px]'
  else if (isChatOpen) gridColsClass = 'grid-cols-[320px_1fr]'
  else if (isBetSlipOpen) gridColsClass = 'grid-cols-[1fr_320px]'

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-sm text-gray-400 hover:text-gray-900 dark:hover:text-white">
          ← Back to all games
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Toggle game chat"
            onClick={() =>
              toggleChat({ matchId: match.id, matchup: `${match.away_team} @ ${match.home_team}` })
            }
            className={`rounded border px-2 py-1.5 text-sm ${
              isChatOpen
                ? 'border-purple-500 bg-purple-600/20 text-gray-900 dark:text-white'
                : 'border-gray-300 text-gray-400 hover:border-purple-500 hover:text-gray-900 dark:border-gray-700 dark:hover:text-white'
            }`}
          >
            💬 Chat
          </button>
          <button
            type="button"
            aria-label="Toggle bet slip"
            onClick={toggleBetSlipOpen}
            className={`rounded border px-2 py-1.5 text-sm ${
              isBetSlipOpen
                ? 'border-purple-500 bg-purple-600/20 text-gray-900 dark:text-white'
                : 'border-gray-300 text-gray-400 hover:border-purple-500 hover:text-gray-900 dark:border-gray-700 dark:hover:text-white'
            }`}
          >
            {isBetSlipOpen ? 'Close' : 'Bet Slip'}
          </button>
        </div>
      </div>

      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {match.away_team} @ {match.home_team}
            </h1>
            {match.is_live && (
              <span className="rounded bg-purple-600 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                Live
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">
            {match.is_live ? (
              <>
                {match.clock} · {match.away_score} - {match.home_score}
              </>
            ) : (
              formatStartTime(match.start_time)
            )}
          </p>
        </div>
        <Scoreboard match={match} />
      </div>

      <div className={`grid gap-4 ${gridColsClass}`}>
        {isChatOpen && (
          <div className="sticky top-4 self-start">
            <GameChat />
          </div>
        )}

        <div className="space-y-6">
          <GameLinesSection match={match} select={select} />
          <AltLinesSection match={match} select={select} />
          <NrfiSection match={match} select={select} />
          <PlayerPropsSection match={match} select={select} />
        </div>

        {isBetSlipOpen && (
          <div className="sticky top-4 self-start">
            <BetSlip />
          </div>
        )}
      </div>
    </div>
  )
}
