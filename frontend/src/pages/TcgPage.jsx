import { useState } from 'react'
import PackStore from '../components/tcg/PackStore'
import PackOpeningFlow from '../components/tcg/PackOpeningFlow'
import MyCollection from '../components/tcg/MyCollection'
import CollectionSidebar from '../components/tcg/CollectionSidebar'
import { useBalance } from '../store/balance'
import { useTcgCollection } from '../store/tcgCollection'

export default function TcgPage() {
  const [tab, setTab] = useState('store') // store | opening | collection
  const [activeTier, setActiveTier] = useState(null)

  const balance = useBalance((state) => state.balance)
  const deduct = useBalance((state) => state.deduct)
  const ownedCards = useTcgCollection((state) => state.ownedCards)

  const handleBuyPack = (tier) => {
    if (balance < tier.price) return
    deduct(tier.price)
    setActiveTier(tier)
    setTab('opening')
  }

  return (
    <div className="grid grid-cols-[1fr_288px] gap-6 p-6">
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

        {tab === 'store' && <PackStore onBuyPack={handleBuyPack} />}
        {tab === 'opening' && activeTier && (
          <PackOpeningFlow tier={activeTier} onDone={() => setTab('store')} onBack={() => setTab('store')} />
        )}
        {tab === 'collection' && <MyCollection />}
      </div>

      <CollectionSidebar />
    </div>
  )
}
