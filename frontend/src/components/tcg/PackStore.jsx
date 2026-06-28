import { useState } from 'react'
import { usePacks } from '../../hooks/usePacks'
import { useBalance } from '../../store/balance'
import { rarityColor, RARITY_RANK } from '../../lib/rarityColors'
import { CATEGORIES } from '../../lib/categories'
import PackTierCard from './PackTierCard'

const CATEGORY_ICON = Object.fromEntries(CATEGORIES.map((cat) => [cat.label, cat.icon]))

function groupByCategory(tiers) {
  const groups = new Map()
  for (const tier of tiers) {
    if (!groups.has(tier.category)) groups.set(tier.category, [])
    groups.get(tier.category).push(tier)
  }
  return groups
}

function CardPool({ tier }) {
  const pullableRarities = new Set(Object.keys(tier.rarity_odds))
  const sortedCards = tier.cards
    .filter((card) => pullableRarities.has(card.rarity))
    .sort(
      (a, b) =>
        RARITY_RANK.indexOf(a.rarity) - RARITY_RANK.indexOf(b.rarity) || a.market_value - b.market_value,
    )

  return (
    <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
      <p className="mb-3 text-sm font-bold text-gray-900 dark:text-white">{tier.name} — Card Pool</p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">
        {sortedCards.map((card) => {
          const colors = rarityColor(card.rarity)
          return (
            <div
              key={card.id}
              className={`rounded border-2 ${colors.border} bg-white p-2 dark:bg-gray-950`}
            >
              <div className="mb-2 flex aspect-[5/7] items-center justify-center overflow-hidden rounded bg-gray-100 dark:bg-gray-900">
                {card.image_url ? (
                  <img src={card.image_url} alt={card.name} className="h-full w-full object-contain" />
                ) : (
                  <p className="px-2 text-center text-xs text-gray-400">{card.name}</p>
                )}
              </div>
              <p className={`text-xs font-bold ${colors.text}`}>{card.rarity}</p>
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{card.name}</p>
              <p className="truncate text-xs text-gray-500">{card.set_name}</p>
              <p className="text-xs font-semibold text-green-400">${card.market_value.toFixed(0)}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function PackStore({ category, onBuyPack }) {
  const { data: packs, isLoading, error } = usePacks()
  const balance = useBalance((state) => state.balance)
  const [openCategories, setOpenCategories] = useState(new Set(['Pokemon']))
  const [expandedTierId, setExpandedTierId] = useState(null)

  const toggleCategory = (groupCategory) => {
    setOpenCategories((prev) => {
      const next = new Set(prev)
      if (next.has(groupCategory)) next.delete(groupCategory)
      else next.add(groupCategory)
      return next
    })
  }

  const toggleTierPulls = (tierId) => {
    setExpandedTierId((prev) => (prev === tierId ? null : tierId))
  }

  if (isLoading) return <p className="text-gray-400">Loading packs…</p>
  if (error) return <p className="text-red-400">Failed to load packs: {error.message}</p>

  const tiersForCategory = category === 'All' ? packs : packs.filter((tier) => tier.category === category)
  const groups = category === 'All' ? groupByCategory(tiersForCategory) : new Map([[category, tiersForCategory]])

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          {category === 'All' ? 'All Categories' : category} Raw Card Pack Store
        </h1>
        <p className="text-sm text-gray-500">Each pack contains one raw card. Higher tiers pull from exclusive card pools.</p>
      </div>

      {[...groups.entries()].map(([groupCategory, tiers]) => {
        const isOpen = category !== 'All' || openCategories.has(groupCategory)

        return (
          <div key={groupCategory} className="space-y-3">
            {category === 'All' && (
              <button
                type="button"
                onClick={() => toggleCategory(groupCategory)}
                className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 transition-colors hover:border-purple-500 dark:border-gray-800 dark:bg-gray-900"
              >
                <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                  {CATEGORY_ICON[groupCategory]} {groupCategory}
                  <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-500 dark:bg-gray-800">
                    {tiers.length}
                  </span>
                </span>
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  className={`h-4 w-4 shrink-0 text-purple-500 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                >
                  <path
                    d="M7 5l6 5-6 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
            {isOpen && (
              <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
                {tiers.map((tier) => (
                  <PackTierCard
                    key={tier.id}
                    tier={tier}
                    disabled={balance < tier.price}
                    onBuy={() => onBuyPack(tier)}
                    isExpanded={expandedTierId === tier.id}
                    onTogglePulls={() => toggleTierPulls(tier.id)}
                  />
                ))}
              </div>
            )}
            {isOpen && expandedTierId && tiers.some((tier) => tier.id === expandedTierId) && (
              <CardPool tier={tiers.find((tier) => tier.id === expandedTierId)} />
            )}
          </div>
        )
      })}
    </div>
  )
}
