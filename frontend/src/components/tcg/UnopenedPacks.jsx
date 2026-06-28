import { tierColor } from '../../lib/rarityColors'
import { useUnopenedPacks } from '../../store/unopenedPacks'
import BoltIcon from '../icons/BoltIcon'

export default function UnopenedPacks({ category, onOpen }) {
  const allUnopenedPacks = useUnopenedPacks((state) => state.unopenedPacks)
  const unopenedPacks =
    category === 'All' ? allUnopenedPacks : allUnopenedPacks.filter((pack) => pack.category === category)

  // Totals are based on tierPrice (what was paid), not the rolled card's
  // value - that value stays hidden until the pack is actually opened.
  const totalCost = unopenedPacks.reduce((sum, pack) => sum + pack.tierPrice, 0)
  const avgCost = unopenedPacks.length > 0 ? totalCost / unopenedPacks.length : 0

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">
        Unopened Packs — {category === 'All' ? 'All Categories' : category} ({unopenedPacks.length})
      </h1>

      <div className="flex gap-6 rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
        <div>
          <p className="text-xs text-gray-500">Total Cost</p>
          <p className="font-bold text-green-400">${totalCost.toFixed(0)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Packs Owned</p>
          <p className="font-bold text-gray-900 dark:text-white">{unopenedPacks.length}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Avg Cost</p>
          <p className="font-bold text-gray-900 dark:text-white">${avgCost.toFixed(0)}</p>
        </div>
      </div>

      {unopenedPacks.length === 0 ? (
        <p className="text-sm text-gray-500">
          No unopened packs — purchases you leave before flipping the card show up here.
        </p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {unopenedPacks.map((pack) => {
            const style = tierColor(pack.tierName)

            return (
              <div
                key={pack.id}
                onClick={() => onOpen(pack)}
                className="flex w-44 cursor-pointer flex-col rounded-lg border border-gray-300 bg-white p-3 transition-transform hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-950"
              >
                <div
                  className={`mb-2 flex aspect-[5/7] flex-col items-center justify-between gap-2 overflow-hidden rounded border-2 bg-gradient-to-br from-slate-300 to-slate-500 p-3 dark:from-gray-800 dark:to-gray-950 ${style.border}`}
                  style={{ boxShadow: `0 0 16px 4px ${style.glow}` }}
                >
                  <p className="text-center text-[9px] font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                    Raw Card Pack
                  </p>
                  <BoltIcon className={`h-8 w-8 ${style.text}/60`} />
                  <div className="rounded border border-black/20 bg-white/40 px-2 py-0.5 dark:border-white/20 dark:bg-black/30">
                    <p className="text-xs font-bold text-gray-900 dark:text-white">${pack.tierPrice.toFixed(0)}</p>
                  </div>
                </div>
                <p className="truncate font-bold text-gray-900 dark:text-white" title={pack.tierName}>
                  {pack.tierName}
                </p>
                <p className="text-xs text-gray-500">{pack.category}</p>
                <div className="mt-auto pt-2">
                  <button
                    type="button"
                    className="w-full rounded bg-purple-600/70 py-1 text-xs font-bold text-white hover:bg-purple-600/90"
                  >
                    Open Pack
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
