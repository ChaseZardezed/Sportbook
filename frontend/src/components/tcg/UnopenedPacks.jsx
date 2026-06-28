import { tierColor } from '../../lib/rarityColors'
import { useUnopenedPacks } from '../../store/unopenedPacks'
import BoltIcon from '../icons/BoltIcon'

export default function UnopenedPacks({ category, onOpen }) {
  const allUnopenedPacks = useUnopenedPacks((state) => state.unopenedPacks)
  const unopenedPacks =
    category === 'All' ? allUnopenedPacks : allUnopenedPacks.filter((pack) => pack.category === category)

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">
        Unopened Packs — {category === 'All' ? 'All Categories' : category} ({unopenedPacks.length})
      </h1>

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
                className={`flex w-44 cursor-pointer flex-col items-center justify-between gap-3 rounded-xl border-2 bg-gradient-to-br from-gray-800 to-gray-950 p-5 transition-transform hover:-translate-y-1 ${style.border}`}
                style={{ boxShadow: `0 0 20px 5px ${style.glow}` }}
              >
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-300">Raw Card Pack</p>
                  <p className="text-sm font-bold text-white">{pack.tierName}</p>
                </div>
                <BoltIcon className={`h-8 w-8 ${style.text}/60`} />
                <div className="rounded border border-white/20 bg-black/30 px-3 py-1">
                  <p className="text-sm font-bold text-white">${pack.tierPrice.toFixed(0)}</p>
                </div>
                <p className="text-xs font-bold text-gray-400">Tap to open</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
