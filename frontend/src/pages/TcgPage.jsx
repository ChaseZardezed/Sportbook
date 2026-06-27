import { useState } from 'react'
import PackStore from '../components/tcg/PackStore'
import PackOpeningFlow from '../components/tcg/PackOpeningFlow'
import MyCollection from '../components/tcg/MyCollection'
import CollectionSidebar from '../components/tcg/CollectionSidebar'
import { useBalance } from '../store/balance'
import { useTcgCollection } from '../store/tcgCollection'
import { CATEGORIES } from '../lib/categories'

export default function TcgPage() {
  const [category, setCategory] = useState('All')
  const [tab, setTab] = useState('store') // store | opening | collection
  const [activeTier, setActiveTier] = useState(null)

  const balance = useBalance((state) => state.balance)
  const ownedCards = useTcgCollection((state) => state.ownedCards)

  const handleBuyPack = (tier) => {
    if (balance < tier.price) return
    setActiveTier(tier)
    setTab('opening')
  }

  return (
    <div className="grid grid-cols-[176px_1fr_288px] gap-6 p-6">
      <div className="space-y-1">
        <p className="mb-2 px-1 text-xs font-semibold uppercase text-gray-500">Categories</p>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.label}
            type="button"
            onClick={() => setCategory(cat.label)}
            className={`flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm font-semibold ${
              category === cat.label ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      <div>
        <div className="mb-4 flex items-center gap-6 border-b border-gray-800 text-sm font-semibold">
          <button
            type="button"
            onClick={() => setTab('store')}
            className={`flex items-center gap-1 border-b-2 pb-3 ${
              tab === 'store' ? 'border-purple-500 text-white' : 'border-transparent text-gray-500 hover:text-white'
            }`}
          >
            💎 Pack Store
          </button>
          <button
            type="button"
            onClick={() => setTab('collection')}
            className={`flex items-center gap-1 border-b-2 pb-3 ${
              tab === 'collection' ? 'border-purple-500 text-white' : 'border-transparent text-gray-500 hover:text-white'
            }`}
          >
            🏆 My Collection ({ownedCards.length})
          </button>
          {tab === 'opening' && (
            <span className="flex items-center gap-1 border-b-2 border-purple-500 pb-3 text-white">
              ✨ Opening Pack
            </span>
          )}
        </div>

        {tab === 'store' && <PackStore category={category} onBuyPack={handleBuyPack} />}
        {tab === 'opening' && activeTier && (
          <PackOpeningFlow tier={activeTier} onDone={() => setTab('store')} onBack={() => setTab('store')} />
        )}
        {tab === 'collection' && <MyCollection category={category} />}
      </div>

      <CollectionSidebar />
    </div>
  )
}
