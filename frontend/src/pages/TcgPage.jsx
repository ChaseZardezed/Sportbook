import { useState } from 'react'
import PackStore from '../components/tcg/PackStore'
import PackOpeningFlow from '../components/tcg/PackOpeningFlow'
import MyCollection from '../components/tcg/MyCollection'
import CollectionSidebar from '../components/tcg/CollectionSidebar'
import UnopenedPacks from '../components/tcg/UnopenedPacks'
import { useBalance } from '../store/balance'
import { useTcgCollection } from '../store/tcgCollection'
import { useUnopenedPacks } from '../store/unopenedPacks'
import { usePacks } from '../hooks/usePacks'
import { CATEGORIES } from '../lib/categories'

const TAB_STORAGE_KEY = 'tcgActiveTab'

function getStoredTab() {
  const stored = localStorage.getItem(TAB_STORAGE_KEY)
  // "opening" can't be resumed after a refresh since the in-flight pack/tier
  // state isn't persisted, so never restore directly into it.
  if (stored === 'store' || stored === 'collection' || stored === 'unopened') return stored
  return 'store'
}

export default function TcgPage() {
  const [category, setCategory] = useState(CATEGORIES[1].label)
  const [tab, setTabState] = useState(getStoredTab) // store | opening | collection | unopened
  // Which tab to return to once the opening flow finishes - 'store' for a
  // fresh purchase, 'unopened' when resuming a pending pull.
  const [returnTab, setReturnTab] = useState('store')
  const [activeTier, setActiveTier] = useState(null)
  // Set when entering 'opening' via an Unopened Packs row instead of a
  // fresh purchase - tells PackOpeningFlow to skip straight to the reveal
  // stage with the already-rolled card instead of showing the buy/confirm UI.
  const [resumePack, setResumePack] = useState(null)

  const balance = useBalance((state) => state.balance)
  const ownedCards = useTcgCollection((state) => state.ownedCards)
  const unopenedPacks = useUnopenedPacks((state) => state.unopenedPacks)
  const { data: packs } = usePacks()

  const setTab = (next) => {
    setTabState(next)
    if (next !== 'opening') localStorage.setItem(TAB_STORAGE_KEY, next)
  }

  // "All" only makes sense as a category filter when browsing owned cards or
  // pending pulls - the Pack Store always needs one concrete category since
  // PackOpeningFlow needs a single tier.cards pool to roll against.
  const visibleCategories =
    tab === 'collection' || tab === 'unopened' ? CATEGORIES : CATEGORIES.filter((cat) => cat.label !== 'All')

  const handleBuyPack = (tier) => {
    if (balance < tier.price) return
    setActiveTier(tier)
    setResumePack(null)
    setReturnTab('store')
    setTab('opening')
  }

  const handleOpenUnopenedPack = (pack) => {
    // UnopenedPackOut only carries a lightweight tier reference (id/name/
    // price), so the full tier (rarity_odds, card pool) has to be looked up
    // from the already-fetched /packs data by id.
    const tier = packs?.find((t) => t.id === pack.packTierId)
    if (!tier) return
    setActiveTier(tier)
    setResumePack(pack)
    setReturnTab('unopened')
    setTab('opening')
  }

  const handleDoneOpening = () => {
    setResumePack(null)
    setTab(returnTab)
  }

  const goToStore = () => {
    if (category === 'All') setCategory(CATEGORIES[1].label)
    setTab('store')
  }

  return (
    <div className="grid grid-cols-[176px_1fr] gap-6 p-6">
      <div className="space-y-1">
        <p className="mb-2 px-1 text-xs font-semibold uppercase text-gray-500">Categories</p>
        {visibleCategories.map((cat) => (
          <button
            key={cat.label}
            type="button"
            onClick={() => setCategory(cat.label)}
            className={`flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm font-semibold ${
              category === cat.label ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      <div>
        <div className="mb-4 flex items-center gap-6 border-b border-gray-200 text-sm font-semibold dark:border-gray-800">
          <button
            type="button"
            onClick={goToStore}
            className={`flex items-center gap-1 border-b-2 pb-3 ${
              tab === 'store' ? 'border-purple-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            💎 Pack Store
          </button>
          <button
            type="button"
            onClick={() => {
              setCategory('All')
              setTab('collection')
            }}
            className={`flex items-center gap-1 border-b-2 pb-3 ${
              tab === 'collection' ? 'border-purple-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            🏆 My Collection ({ownedCards.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setCategory('All')
              setTab('unopened')
            }}
            className={`flex items-center gap-1 border-b-2 pb-3 ${
              tab === 'unopened' ? 'border-purple-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            📦 Unopened Packs ({unopenedPacks.length})
          </button>
        </div>

        <div className="grid grid-cols-[1fr_288px] gap-6">
          <div>
            {tab === 'store' && <PackStore category={category} onBuyPack={handleBuyPack} />}
            {tab === 'opening' && activeTier && (
              <PackOpeningFlow
                tier={activeTier}
                resumePack={resumePack}
                onDone={handleDoneOpening}
                onBack={handleDoneOpening}
              />
            )}
            {tab === 'collection' && <MyCollection category={category} />}
            {tab === 'unopened' && <UnopenedPacks category={category} onOpen={handleOpenUnopenedPack} />}
          </div>

          <div className="sticky top-4 self-start">
            <CollectionSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
