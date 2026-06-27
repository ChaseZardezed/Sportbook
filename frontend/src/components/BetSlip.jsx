import { useBetSlip } from '../store/betSlip'
import { formatOdds } from '../lib/odds'

const QUICK_STAKES = [10, 25, 50, 100]

function SelectionRow({ selection }) {
  const removeSelection = useBetSlip((state) => state.removeSelection)
  const setStake = useBetSlip((state) => state.setStake)

  return (
    <div className="rounded border border-gray-800 bg-gray-900 p-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400">{selection.matchup}</p>
          <p className="font-semibold text-white">
            {selection.label} ({formatOdds(selection.odds)})
          </p>
        </div>
        <button
          type="button"
          onClick={() => removeSelection(selection.id)}
          className="text-gray-500 hover:text-white"
        >
          ✕
        </button>
      </div>
      <div className="mt-2 flex gap-2">
        {QUICK_STAKES.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => setStake(selection.id, amount)}
            className={`flex-1 rounded border px-2 py-1 text-xs font-medium ${
              selection.stake === amount
                ? 'border-purple-500 bg-purple-600/20 text-white'
                : 'border-gray-700 text-gray-300 hover:border-purple-500'
            }`}
          >
            ${amount}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function BetSlip() {
  const selectionsMap = useBetSlip((state) => state.selections)
  const clear = useBetSlip((state) => state.clear)
  const selections = Object.values(selectionsMap)

  const totalStake = selections.reduce((sum, s) => sum + (s.stake || 0), 0)

  return (
    <div className="flex h-full flex-col rounded-lg border border-gray-800 bg-gray-950">
      <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
        <h2 className="font-bold text-white">
          Bet Slip {selections.length > 0 && `(${selections.length})`}
        </h2>
        {selections.length > 0 && (
          <button type="button" onClick={clear} className="text-xs text-gray-400 hover:text-white">
            Clear All
          </button>
        )}
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {selections.length === 0 ? (
          <p className="p-4 text-center text-sm text-gray-500">
            Click any odds to add it to your bet slip
          </p>
        ) : (
          selections.map((selection) => <SelectionRow key={selection.id} selection={selection} />)
        )}
      </div>

      {selections.length > 0 && (
        <div className="border-t border-gray-800 p-3">
          <button
            type="button"
            disabled={totalStake === 0}
            className="w-full rounded bg-purple-600 py-2 font-semibold text-white hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Place Bet (${totalStake.toFixed(2)})
          </button>
        </div>
      )}
    </div>
  )
}
