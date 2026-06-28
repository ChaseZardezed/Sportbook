import { useEffect, useState } from 'react'
import { useTcgCollection } from '../../store/tcgCollection'
import { rarityColor } from '../../lib/rarityColors'
import { formatTimeAgo } from '../../lib/time'

const RARITY_LEGEND = [
  { label: 'Common', color: 'bg-gray-400', min: 5, max: 20 },
  { label: 'Uncommon', color: 'bg-green-500', min: 21, max: 60 },
  { label: 'Rare', color: 'bg-blue-500', min: 61, max: 120 },
  { label: 'Epic', color: 'bg-purple-500', min: 121, max: 400 },
  { label: 'Legendary', color: 'bg-amber-500', min: 401, max: 1400 },
  { label: 'Mythical', color: 'bg-red-500', min: 1401, max: 25000 },
]

const UPDATE_INTERVAL_SECONDS = 30
const HISTORY_TABS = ['sold', 'shipped']
const HISTORY_PREVIEW_COUNT = 4

function HistoryRow({ entry }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-10 w-8 shrink-0 items-center justify-center overflow-hidden rounded border ${rarityColor(entry.rarity).border} bg-gray-100 text-[8px] font-bold text-gray-500 dark:bg-gray-900`}
      >
        {entry.imageUrl ? (
          <img src={entry.imageUrl} alt={entry.name} className="h-full w-full object-cover" />
        ) : (
          entry.name.slice(0, 3).toUpperCase()
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-gray-900 dark:text-white">{entry.name}</p>
        <p className="text-[10px] text-gray-500">{formatTimeAgo(entry.timestamp)}</p>
      </div>
      <p className="text-xs font-semibold text-gray-900 dark:text-white">${entry.value.toFixed(0)}</p>
    </div>
  )
}

function HistoryModal({ activeTab, onTabChange, entries, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6" onClick={onClose}>
      <div
        className="flex max-h-[80vh] w-full max-w-md flex-col rounded-lg border border-gray-300 bg-white p-4 dark:border-gray-800 dark:bg-gray-950"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">Sold &amp; Ship History</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-500 hover:border-purple-500 hover:text-gray-900 dark:border-gray-700 dark:hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="mb-3 flex gap-2">
          {HISTORY_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`flex-1 rounded-full border px-3 py-1 text-xs font-semibold capitalize transition-colors ${
                activeTab === tab
                  ? 'border-purple-500 bg-gray-100 text-purple-600 dark:bg-gray-900 dark:text-purple-300'
                  : 'border-gray-300 text-gray-500 hover:border-purple-500 dark:border-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {entries.length === 0 ? (
          <p className="text-xs text-gray-500">No {activeTab} cards yet.</p>
        ) : (
          <div className="space-y-2 overflow-y-auto">
            {entries.map((entry) => (
              <HistoryRow key={`${entry.id}-${entry.timestamp}`} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function CollectionSidebar() {
  const ownedCards = useTcgCollection((state) => state.ownedCards)
  const history = useTcgCollection((state) => state.history)
  const fluctuateValues = useTcgCollection((state) => state.fluctuateValues)
  const [secondsLeft, setSecondsLeft] = useState(UPDATE_INTERVAL_SECONDS)
  const [historyTab, setHistoryTab] = useState('sold')
  const [historyExpanded, setHistoryExpanded] = useState(false)

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

  const filteredHistory = history.filter((entry) => entry.action === historyTab)

  return (
    <div className="w-72 space-y-3">
      <div className="rounded-lg border border-gray-300 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
        <p className="text-xs text-gray-500">Total Value</p>
        <p className="text-2xl font-bold text-green-400">${totalValue.toFixed(0)}</p>
        <p className="text-xs text-gray-500">Cards: {ownedCards.length}</p>
      </div>

      {bestPull && (
        <div className="rounded-lg border border-gray-300 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <p className="mb-2 text-xs text-gray-500">Best Pull</p>
          <div className="flex items-center gap-3">
            <div
              className={`flex h-16 w-12 shrink-0 items-center justify-center overflow-hidden rounded border ${rarityColor(bestPull.rarity).border} bg-gray-100 text-[10px] font-bold text-gray-500 dark:bg-gray-900`}
            >
              {bestPull.imageUrl ? (
                <img src={bestPull.imageUrl} alt={bestPull.name} className="h-full w-full object-cover" />
              ) : (
                bestPull.name.slice(0, 3).toUpperCase()
              )}
            </div>
            <div>
              <p className={`text-xs ${rarityColor(bestPull.rarity).text}`}>{bestPull.rarity}</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{bestPull.name}</p>
              <p className="text-sm font-semibold text-green-400">${bestPull.currentValue.toFixed(0)}</p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-gray-300 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
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

      <div className="rounded-lg border border-gray-300 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
        <p className="mb-2 text-xs text-gray-500">Sold &amp; Ship History</p>

        <div className="mb-2 flex gap-2">
          {HISTORY_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setHistoryTab(tab)}
              className={`flex-1 rounded-full border px-2 py-1 text-xs font-semibold capitalize transition-colors ${
                historyTab === tab
                  ? 'border-purple-500 bg-gray-100 text-purple-600 dark:bg-gray-900 dark:text-purple-300'
                  : 'border-gray-300 text-gray-500 hover:border-purple-500 dark:border-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {filteredHistory.length === 0 ? (
          <p className="text-xs text-gray-500">No {historyTab} cards yet.</p>
        ) : (
          <>
            <div className="space-y-2">
              {filteredHistory.slice(0, HISTORY_PREVIEW_COUNT).map((entry) => (
                <HistoryRow key={`${entry.id}-${entry.timestamp}`} entry={entry} />
              ))}
            </div>
            {filteredHistory.length > HISTORY_PREVIEW_COUNT && (
              <button
                type="button"
                onClick={() => setHistoryExpanded(true)}
                className="mt-2 text-xs font-semibold text-purple-500 hover:underline"
              >
                View full history ({filteredHistory.length}) →
              </button>
            )}
          </>
        )}
      </div>

      {historyExpanded && (
        <HistoryModal
          activeTab={historyTab}
          onTabChange={setHistoryTab}
          entries={filteredHistory}
          onClose={() => setHistoryExpanded(false)}
        />
      )}
    </div>
  )
}
