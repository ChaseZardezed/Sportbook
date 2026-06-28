import { useEffect, useState } from 'react'
import { useTcgCollection } from '../../store/tcgCollection'

const RARITY_LEGEND = [
  { label: 'Common', color: 'bg-gray-400', min: 5, max: 20 },
  { label: 'Uncommon', color: 'bg-green-500', min: 21, max: 60 },
  { label: 'Rare', color: 'bg-blue-500', min: 61, max: 120 },
  { label: 'Epic', color: 'bg-purple-500', min: 121, max: 400 },
  { label: 'Legendary', color: 'bg-amber-500', min: 401, max: 1400 },
  { label: 'Mythical', color: 'bg-red-500', min: 1401, max: 25000 },
]

const UPDATE_INTERVAL_SECONDS = 30

export default function CollectionSidebar() {
  const ownedCards = useTcgCollection((state) => state.ownedCards)
  const fluctuateValues = useTcgCollection((state) => state.fluctuateValues)
  const [secondsLeft, setSecondsLeft] = useState(UPDATE_INTERVAL_SECONDS)

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((seconds) => {
        if (seconds <= 1) {
          fluctuateValues()
          return UPDATE_INTERVAL_SECONDS
        }
        return seconds - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [fluctuateValues])

  const totalValue = ownedCards.reduce((sum, card) => sum + card.currentValue, 0)
  const bestPull = ownedCards.reduce(
    (best, card) => (!best || card.currentValue > best.currentValue ? card : best),
    null,
  )

  return (
    <div className="w-72 space-y-3">
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
        <p className="text-xs text-gray-500">Total Value</p>
        <p className="text-2xl font-bold text-green-400">${totalValue.toFixed(0)}</p>
        <p className="text-xs text-gray-500">Cards: {ownedCards.length}</p>
      </div>

      {bestPull && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <p className="mb-2 text-xs text-gray-500">Best Pull</p>
          <div className="flex items-center gap-3">
            <div className="flex h-16 w-12 shrink-0 items-center justify-center rounded border border-purple-500 bg-gray-100 text-[10px] font-bold text-purple-700 dark:bg-gray-900 dark:text-purple-300">
              {bestPull.name.slice(0, 3).toUpperCase()}
            </div>
            <div>
              <p className="text-xs text-purple-400">{bestPull.rarity}</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{bestPull.name}</p>
              <p className="text-sm font-semibold text-green-400">${bestPull.currentValue.toFixed(0)}</p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
        <p className="mb-2 flex items-center gap-1 text-xs text-gray-500">
          🕐 Market update in {secondsLeft}s
        </p>
        <div className="space-y-1.5">
          {RARITY_LEGEND.map((rarity) => (
            <div key={rarity.label} className="flex items-center justify-between gap-2 text-xs text-gray-400">
              <span className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${rarity.color}`} />
                {rarity.label}
              </span>
              <span className="text-gray-500">
                ${rarity.min}–${rarity.max}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
