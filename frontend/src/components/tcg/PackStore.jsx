import { usePacks } from '../../hooks/usePacks'
import { useBalance } from '../../store/balance'
import { useTcgCollection } from '../../store/tcgCollection'
import PackTierCard from './PackTierCard'

export default function PackStore({ onBuyPack }) {
  const { data: packs, isLoading, error } = usePacks()
  const balance = useBalance((state) => state.balance)
  const lastPull = useTcgCollection((state) => state.lastPull)

  if (isLoading) return <p className="text-gray-400">Loading packs…</p>
  if (error) return <p className="text-red-400">Failed to load packs: {error.message}</p>

  return (
    <div className="space-y-4">
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
        <h1 className="text-xl font-bold text-white">Slab Pack Store</h1>
        <p className="text-sm text-gray-500">Each pack contains one graded slab. Higher tiers pull from exclusive card pools.</p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        {packs.map((tier) => (
          <PackTierCard
            key={tier.id}
            tier={tier}
            disabled={balance < tier.price}
            onBuy={() => onBuyPack(tier)}
          />
        ))}
      </div>
    </div>
  )
}
