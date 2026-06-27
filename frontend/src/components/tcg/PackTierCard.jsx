import { tierColor } from '../../lib/rarityColors'

const RARITY_BAR_COLOR = {
  Common: 'bg-gray-400',
  Uncommon: 'bg-green-500',
  Rare: 'bg-blue-500',
  'Ultra Rare': 'bg-purple-500',
  'Secret Rare': 'bg-amber-500',
  '1st Edition': 'bg-red-500',
}

export default function PackTierCard({ tier, onBuy, disabled }) {
  const style = tierColor(tier.name)

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-800 bg-gray-950 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className={`bg-gradient-to-br ${style.gradient} px-4 py-4`}>
        <p className={`flex items-center gap-1 text-sm font-bold ${style.text}`}>
          {style.icon} {tier.name}
        </p>
        <p className="text-2xl font-bold text-white">${tier.price.toFixed(0)}</p>
      </div>

      <div className="flex-1 space-y-3 p-4">
        <p className="text-xs text-gray-400">{tier.description}</p>
        <p className="text-xs text-purple-400">✦ Top pull: {tier.top_pull_text}</p>

        <div className="space-y-1.5">
          {Object.entries(tier.rarity_odds).map(([rarity, odds]) => (
            <div key={rarity} className="flex items-center gap-2 text-xs">
              <span className="w-20 shrink-0 text-gray-400">{rarity}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-800">
                <div
                  className={`h-full ${RARITY_BAR_COLOR[rarity] ?? 'bg-gray-500'}`}
                  style={{ width: `${odds}%` }}
                />
              </div>
              <span className="w-9 shrink-0 text-right text-gray-500">{odds}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 pt-0">
        <button
          type="button"
          disabled={disabled}
          onClick={onBuy}
          className="w-full rounded bg-green-600 py-2 text-sm font-bold text-white transition-colors hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Buy Pack — ${tier.price.toFixed(0)}
        </button>
      </div>
    </div>
  )
}
