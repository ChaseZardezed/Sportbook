import { useState } from 'react'
import { usePacks } from '../../hooks/usePacks'
import { useBalance } from '../../store/balance'
import { useTcgCollection } from '../../store/tcgCollection'
import PackTierCard from './PackTierCard'

function groupByCategory(tiers) {
  const groups = new Map()
  for (const tier of tiers) {
    if (!groups.has(tier.category)) groups.set(tier.category, [])
    groups.get(tier.category).push(tier)
  }
  return groups
}

export default function PackStore({ category, onBuyPack }) {
  const { data: packs, isLoading, error } = usePacks()
  const balance = useBalance((state) => state.balance)
  const lastPull = useTcgCollection((state) => state.lastPull)
  const [openCategories, setOpenCategories] = useState(new Set())

  const toggleCategory = (groupCategory) => {
    setOpenCategories((prev) => {
      const next = new Set(prev)
      if (next.has(groupCategory)) next.delete(groupCategory)
      else next.add(groupCategory)
      return next
    })
  }

  if (isLoading) return <p className="text-gray-400">Loading packs…</p>
  if (error) return <p className="text-red-400">Failed to load packs: {error.message}</p>

  const tiersForCategory = category === 'All' ? packs : packs.filter((tier) => tier.category === category)
  const groups = category === 'All' ? groupByCategory(tiersForCategory) : new Map([[category, tiersForCategory]])

  return (
    <div className="space-y-6">
      {lastPull && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm font-semibold ${
            lastPull.delta >= 0
              ? 'border-green-700 bg-green-900/30 text-green-400'
              : 'border-red-700 bg-red-900/30 text-red-400'
          }`}
        >
          {lastPull.delta >= 0 ? '↗' : '↘'} Last pull: {lastPull.delta >= 0 ? '+' : ''}$
          {lastPull.delta.toFixed(0)} vs pack cost
        </div>
      )}

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
                className="flex w-full items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <span className={`transition-transform ${isOpen ? 'rotate-90' : ''}`}>▶</span>
                {groupCategory}
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
                  />
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
