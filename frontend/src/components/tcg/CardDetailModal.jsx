export default function CardDetailModal({ card, onClose }) {
  const changed = card.currentValue !== card.pulledValue
  const wentUp = card.currentValue > card.pulledValue
  const statEntries = card.stats ? Object.entries(card.stats) : []

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-full w-full max-w-2xl gap-6 overflow-y-auto rounded-lg border border-gray-300 bg-white p-6 dark:border-gray-800 dark:bg-gray-950"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="w-48 shrink-0">
          <div className="mb-3 flex aspect-[5/7] flex-col overflow-hidden rounded border-2 border-gray-400 bg-gray-200 text-gray-900">
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
          {card.statsImageUrl && (
            <div className="aspect-[5/7] overflow-hidden rounded border border-gray-300 dark:border-gray-800">
              <img src={card.statsImageUrl} alt={`${card.name} stats`} className="h-full w-full object-contain" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{card.name}</h2>
              <p className="text-sm text-gray-500">
                {card.rarity} • {card.category}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded border border-gray-300 px-2 py-1 text-sm text-gray-500 hover:border-purple-500 hover:text-gray-900 dark:border-gray-700 dark:hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-gray-500">Set</p>
              <p className="font-semibold text-gray-900 dark:text-white">{card.setName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Card #</p>
              <p className="font-semibold text-gray-900 dark:text-white">{card.cardNumber}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Current Value</p>
              <p className="font-semibold text-green-400">
                ${card.currentValue.toFixed(0)}
                {changed && (
                  <span className={`ml-1 text-xs ${wentUp ? 'text-green-500' : 'text-red-500'}`}>
                    {wentUp ? '↗︎' : '↘︎'}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Player / Card Stats</p>
            {statEntries.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 text-sm">
                {statEntries.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded border border-gray-300 px-3 py-1.5 dark:border-gray-800"
                  >
                    <span className="text-gray-500">{label}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Stats coming soon for this card.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
