import { useTcgCollection } from '../../store/tcgCollection'
import { useBalance } from '../../store/balance'

function CollectionCard({ card }) {
  const removeCard = useTcgCollection((state) => state.removeCard)
  const credit = useBalance((state) => state.credit)

  const handleSell = () => {
    credit(card.currentValue)
    removeCard(card.ownedId)
  }

  const handleShip = () => {
    removeCard(card.ownedId)
  }

  const changed = card.currentValue !== card.pulledValue
  const wentUp = card.currentValue > card.pulledValue

  return (
    <div className="w-44 rounded-lg border border-gray-800 bg-gray-950 p-3">
      <div className="mb-2 flex h-32 flex-col overflow-hidden rounded border-2 border-blue-500 bg-gray-200 text-gray-900">
        <div className="flex items-center justify-between bg-blue-700 px-2 py-0.5 text-[9px] font-bold text-white">
          <span>PSA</span>
          <span className="rounded bg-blue-900 px-1">{card.rarity.slice(0, 4).toUpperCase()}</span>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm font-bold text-gray-700">{card.name}</p>
        </div>
        <div className="flex items-center justify-between bg-blue-700 px-2 py-0.5 text-[10px] font-bold text-white">
          <span>GRADE</span>
          <span>{card.grade}</span>
        </div>
      </div>
      <p className="text-xs text-gray-500">
        {card.rarity} • {card.category}
      </p>
      <p className="font-bold text-white">{card.name}</p>
      <p className="text-xs text-gray-500">
        PSA {card.grade} • {card.setName}
      </p>
      <p className="font-semibold text-green-400">
        ${card.currentValue.toFixed(0)}
        {changed && <span className="ml-1 text-xs">{wentUp ? '↗' : '↘'}</span>}
      </p>
      <div className="mt-2 flex gap-2">
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
          className="flex-1 rounded border border-gray-700 py-1 text-xs font-bold text-gray-300 hover:border-purple-500"
        >
          🚀 Ship
        </button>
      </div>
    </div>
  )
}

export default function MyCollection({ category }) {
  const allOwnedCards = useTcgCollection((state) => state.ownedCards)
  const ownedCards =
    category === 'All' ? allOwnedCards : allOwnedCards.filter((card) => card.category === category)

  const totalValue = ownedCards.reduce((sum, card) => sum + card.currentValue, 0)
  const avgValue = ownedCards.length > 0 ? totalValue / ownedCards.length : 0

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-white">
        My Collection — {category === 'All' ? 'All Categories' : category} ({ownedCards.length})
      </h1>

      <div className="flex gap-6 rounded-lg border border-gray-800 bg-gray-900 px-4 py-3">
        <div>
          <p className="text-xs text-gray-500">Total Market Value</p>
          <p className="font-bold text-green-400">${totalValue.toFixed(0)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Cards Owned</p>
          <p className="font-bold text-white">{ownedCards.length}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Avg Value</p>
          <p className="font-bold text-white">${avgValue.toFixed(0)}</p>
        </div>
      </div>

      {ownedCards.length === 0 ? (
        <p className="text-sm text-gray-500">No cards yet — open a pack to start your collection.</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {ownedCards.map((card) => (
            <CollectionCard key={card.ownedId} card={card} />
          ))}
        </div>
      )}
    </div>
  )
}
