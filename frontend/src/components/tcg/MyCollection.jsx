import { useState } from 'react'
import { useTcgCollection } from '../../store/tcgCollection'
import { useBalance } from '../../store/balance'
import { rarityColor, RARITY_RANK } from '../../lib/rarityColors'
import CardDetailModal from './CardDetailModal'

const RARITY_FILTERS = ['All', ...RARITY_RANK]

function CollectionCard({ card, onSelect }) {
  const removeCard = useTcgCollection((state) => state.removeCard)
  const credit = useBalance((state) => state.credit)
  const colors = rarityColor(card.rarity)

  const handleSell = (event) => {
    event.stopPropagation()
    credit(card.currentValue)
    removeCard(card.ownedId, 'sold')
  }

  const handleShip = (event) => {
    event.stopPropagation()
    removeCard(card.ownedId, 'shipped')
  }

  const changed = card.currentValue !== card.pulledValue
  const wentUp = card.currentValue > card.pulledValue

  return (
    <div
      onClick={() => onSelect(card)}
      className="flex w-44 cursor-pointer flex-col rounded-lg border border-gray-300 bg-white p-3 transition-transform hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-950"
    >
      <div className={`mb-2 flex aspect-[5/7] flex-col overflow-hidden rounded border-2 ${colors.border} bg-gray-200 text-gray-900`}>
        {card.imageUrl ? (
          <img src={card.imageUrl} alt={card.name} className="h-full w-full object-contain" />
        ) : (
          <>
            <div className="flex items-center justify-end bg-blue-700 px-2 py-0.5 text-[9px] font-bold text-white">
              <span className="rounded bg-blue-900 px-1">{card.rarity.slice(0, 4).toUpperCase()}</span>
            </div>
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm font-bold text-gray-700">{card.name}</p>
            </div>
          </>
        )}
      </div>
      <p className={`text-xs ${colors.text}`}>
        {card.rarity} • {card.category}
      </p>
      <p className="font-bold text-gray-900 dark:text-white">{card.name}</p>
      <p className="text-xs text-gray-500">{card.setName}</p>
      <p className="font-semibold text-green-400">
        ${card.currentValue.toFixed(0)}
        {changed && (
          <span className={`ml-1 text-xs ${wentUp ? 'text-green-500' : 'text-red-500'}`}>
            {wentUp ? '↗︎' : '↘︎'}
          </span>
        )}
      </p>
      <div className="mt-auto flex gap-2 pt-2">
        <button
          type="button"
          onClick={handleSell}
          className="flex-1 rounded bg-green-700 py-1 text-xs font-bold text-white hover:bg-green-600"
        >
          Sell
        </button>
        <button
          type="button"
          onClick={handleShip}
          className="flex-1 rounded border border-gray-300 py-1 text-xs font-bold text-gray-600 hover:border-purple-500 dark:border-gray-700 dark:text-gray-300"
        >
          🚀 Ship
        </button>
      </div>
    </div>
  )
}

export default function MyCollection({ category }) {
  const allOwnedCards = useTcgCollection((state) => state.ownedCards)
  const byCategory =
    category === 'All' ? allOwnedCards : allOwnedCards.filter((card) => card.category === category)

  const [rarityFilter, setRarityFilter] = useState('All')
  const ownedCards =
    rarityFilter === 'All'
      ? [...byCategory].sort((a, b) => RARITY_RANK.indexOf(b.rarity) - RARITY_RANK.indexOf(a.rarity))
      : byCategory.filter((card) => card.rarity === rarityFilter)

  const totalValue = ownedCards.reduce((sum, card) => sum + card.currentValue, 0)
  const avgValue = ownedCards.length > 0 ? totalValue / ownedCards.length : 0
  const [selectedCard, setSelectedCard] = useState(null)

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">
        My Collection — {category === 'All' ? 'All Categories' : category} ({ownedCards.length})
      </h1>

      <div className="flex gap-6 rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
        <div>
          <p className="text-xs text-gray-500">Total Market Value</p>
          <p className="font-bold text-green-400">${totalValue.toFixed(0)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Cards Owned</p>
          <p className="font-bold text-gray-900 dark:text-white">{ownedCards.length}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Avg Value</p>
          <p className="font-bold text-gray-900 dark:text-white">${avgValue.toFixed(0)}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {RARITY_FILTERS.map((rarity) => {
          const isActive = rarityFilter === rarity
          const colors = rarity === 'All' ? null : rarityColor(rarity)
          return (
            <button
              key={rarity}
              type="button"
              onClick={() => setRarityFilter(rarity)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                isActive
                  ? `${colors ? colors.border : 'border-purple-500'} ${colors ? colors.text : 'text-purple-600 dark:text-purple-300'} bg-gray-100 dark:bg-gray-900`
                  : 'border-gray-300 text-gray-500 hover:border-purple-500 dark:border-gray-700'
              }`}
            >
              {rarity}
            </button>
          )
        })}
      </div>

      {ownedCards.length === 0 ? (
        <p className="text-sm text-gray-500">No cards yet — open a pack to start your collection.</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {ownedCards.map((card) => (
            <CollectionCard key={card.ownedId} card={card} onSelect={setSelectedCard} />
          ))}
        </div>
      )}

      {selectedCard && <CardDetailModal card={selectedCard} onClose={() => setSelectedCard(null)} />}
    </div>
  )
}
