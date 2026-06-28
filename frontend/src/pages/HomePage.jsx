import { useNavigate } from 'react-router-dom'
import { useCurrentUser } from '../store/currentUser'
import { useBalance } from '../store/balance'
import { usePlacedBets } from '../store/placedBets'
import { useTcgCollection } from '../store/tcgCollection'
import { useMatches } from '../hooks/useMatches'
import { findMarket, formatOdds } from '../lib/odds'
import { rarityColor } from '../lib/rarityColors'
import { formatStartTime } from '../lib/time'
import BetSlip from '../components/BetSlip'

function StatCard({ icon, label, value, valueClass, sublabel }) {
  return (
    <div className="rounded-lg border border-gray-300 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
      <p className="flex items-center gap-1.5 text-xs text-gray-500">
        {icon} {label}
      </p>
      <p className={`mt-1 text-2xl font-bold ${valueClass}`}>{value}</p>
      <p className="text-xs text-gray-500">{sublabel}</p>
    </div>
  )
}

function LiveNowRow({ match }) {
  const navigate = useNavigate()
  const moneyline = findMarket(match.markets, 'moneyline')

  return (
    <button
      type="button"
      onClick={() => navigate(`/game/${match.id}`)}
      className="flex w-full items-center justify-between border-b border-gray-300 px-2 py-3 text-left transition-colors last:border-0 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-gray-900"
    >
      <div>
        <div className="flex items-center gap-2">
          {match.is_live ? (
            <span className="rounded bg-purple-600 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
              Live {match.clock}
            </span>
          ) : (
            <span className="text-xs text-gray-500">{formatStartTime(match.start_time)}</span>
          )}
        </div>
        <p className="font-semibold text-gray-900 dark:text-white">{match.home_team}</p>
        <p className="text-xs text-gray-500">vs {match.away_team}</p>
      </div>
      {moneyline && (
        <div className="text-right text-sm font-bold">
          <p className={moneyline.data.home >= 0 ? 'text-green-500' : 'text-red-500'}>
            {formatOdds(moneyline.data.home)}
          </p>
          <p className={moneyline.data.away >= 0 ? 'text-green-500' : 'text-red-500'}>
            {formatOdds(moneyline.data.away)}
          </p>
        </div>
      )}
    </button>
  )
}

function PackHistoryRow({ card }) {
  const navigate = useNavigate()
  const colors = rarityColor(card.rarity)

  return (
    <button
      type="button"
      onClick={() => navigate('/tcg', { state: { tab: 'collection' } })}
      className="flex w-full items-center gap-3 border-b border-gray-300 px-2 py-3 text-left transition-colors last:border-0 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-gray-900"
    >
      <div
        className={`flex h-16 w-12 shrink-0 items-center justify-center overflow-hidden rounded border ${colors.border} bg-gray-100 text-[10px] font-bold text-gray-500 dark:bg-gray-900`}
      >
        {card.imageUrl ? (
          <img src={card.imageUrl} alt={card.name} className="h-full w-full object-cover" />
        ) : (
          card.name.slice(0, 3).toUpperCase()
        )}
      </div>
      <div>
        <p className={`text-xs ${colors.text}`}>{card.rarity}</p>
        <p className="text-sm font-bold text-gray-900 dark:text-white">{card.name}</p>
        <p className="text-sm font-semibold text-green-500">${card.pulledValue.toFixed(0)}</p>
      </div>
    </button>
  )
}

const PROMOS = [
  {
    icon: '⭐',
    iconClass: 'bg-green-600/15 text-green-400',
    title: 'Parlay Boost',
    subtitle: 'Up to 12x payout on 4+ leg parlays',
  },
  {
    icon: '💎',
    iconClass: 'bg-purple-600/15 text-purple-400',
    title: 'TCG Welcome',
    subtitle: 'Free Bronze Slab Pack on first deposit',
  },
  {
    icon: '🏆',
    iconClass: 'bg-amber-600/15 text-amber-400',
    title: 'Refer a Friend',
    subtitle: '$25 credit when they place first bet',
  },
]

export default function HomePage() {
  const navigate = useNavigate()
  const user = useCurrentUser((state) => state.user)
  const balance = useBalance((state) => state.balance)
  const placedBets = usePlacedBets((state) => state.placedBets)
  const ownedCards = useTcgCollection((state) => state.ownedCards)
  const { data: matches } = useMatches()

  const collectionValue = ownedCards.reduce((sum, card) => sum + card.currentValue, 0)

  const liveMatches = [...(matches ?? [])]
    .sort((a, b) => Number(b.is_live) - Number(a.is_live) || Number(b.is_featured) - Number(a.is_featured))
    .slice(0, 4)

  const packHistory = [...ownedCards]
    .sort((a, b) => new Date(b.pulledAt) - new Date(a.pulledAt))
    .slice(0, 4)

  return (
    <div className="space-y-6 p-6">
      <div className="rounded-lg border border-purple-200 bg-gradient-to-br from-purple-100 to-white p-6 dark:border-purple-900/40 dark:from-purple-900/30 dark:to-gray-950">
        <p className="text-sm text-purple-600 dark:text-purple-400">Good morning,</p>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.first_name ?? 'Player'}</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Here is your Strike dashboard. Ready to play?</p>
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/sports')}
            className="flex items-center gap-1.5 rounded bg-purple-600 px-4 py-2 text-sm font-bold text-white hover:bg-purple-500"
          >
            ⚡ View Live Odds
          </button>
          <button
            type="button"
            onClick={() => navigate('/tcg', { state: { tab: 'store' } })}
            className="flex items-center gap-1.5 rounded border border-purple-300 bg-white px-4 py-2 text-sm font-bold text-gray-900 transition-colors hover:border-purple-500 hover:bg-purple-50 dark:border-gray-600 dark:bg-gray-900/60 dark:text-white dark:hover:bg-gray-800"
          >
            💎 Open Packs
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
          <StatCard
            icon="💰"
            label="Balance"
            value={`$${balance.toFixed(2)}`}
            valueClass="text-green-500"
            sublabel="Available to bet"
          />
          <StatCard
            icon="📊"
            label="Active Bets"
            value={placedBets.length}
            valueClass="text-gray-900 dark:text-white"
            sublabel={placedBets.length > 0 ? `${placedBets.length} open positions` : 'No open positions'}
          />
          <StatCard
            icon="💎"
            label="Collection"
            value={`$${collectionValue.toFixed(0)}`}
            valueClass="text-purple-400"
            sublabel={`${ownedCards.length} slabs owned`}
          />
          <StatCard
            icon="🏆"
            label="Win Rate"
            value="—"
            valueClass="text-gray-900 dark:text-white"
            sublabel="Place a bet to start"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-lg border border-gray-300 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
            <div className="mb-1 flex items-center justify-between">
              <p className="flex items-center gap-1.5 font-bold text-gray-900 dark:text-white">🔥 Live Now</p>
              <button
                type="button"
                onClick={() => navigate('/sports')}
                className="rounded px-2 py-1 text-xs font-semibold text-green-500 transition-colors hover:bg-green-500/10 hover:underline"
              >
                All games →
              </button>
            </div>
            {liveMatches.map((match) => (
              <LiveNowRow key={match.id} match={match} />
            ))}
          </div>

          <div className="rounded-lg border border-gray-300 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
            <div className="mb-1 flex items-center justify-between">
              <p className="flex items-center gap-1.5 font-bold text-gray-900 dark:text-white">📦 Pack Opening History</p>
              <button
                type="button"
                onClick={() => navigate('/tcg', { state: { tab: 'collection' } })}
                className="rounded px-2 py-1 text-xs font-semibold text-green-500 transition-colors hover:bg-green-500/10 hover:underline"
              >
                View collection →
              </button>
            </div>
            {packHistory.length > 0 ? (
              packHistory.map((card) => <PackHistoryRow key={card.ownedId} card={card} />)
            ) : (
              <p className="py-3 text-sm text-gray-500">No packs opened yet — open one to see it here.</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {PROMOS.map((promo) => (
            <div
              key={promo.title}
              className="rounded-lg border border-gray-300 bg-white p-4 dark:border-gray-800 dark:bg-gray-950"
            >
              <span className={`flex h-9 w-9 items-center justify-center rounded ${promo.iconClass}`}>
                {promo.icon}
              </span>
              <p className="mt-2 font-bold text-gray-900 dark:text-white">{promo.title}</p>
              <p className="text-xs text-gray-500">{promo.subtitle}</p>
            </div>
          ))}
        </div>
        </div>

        <div className="sticky top-4 self-start">
          <BetSlip />
        </div>
      </div>
    </div>
  )
}
