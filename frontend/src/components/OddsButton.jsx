import { formatOdds } from '../lib/odds'
import { useBetSlip } from '../store/betSlip'

export default function OddsButton({ id, label, odds, onClick }) {
  const isSelected = useBetSlip((state) => Boolean(state.selections[id]))

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded border px-2 py-1.5 text-sm font-medium ${
        isSelected
          ? 'border-purple-500 bg-purple-600/20 text-white'
          : 'border-gray-700 bg-gray-900 text-gray-200 hover:border-purple-500 hover:text-white'
      }`}
    >
      {label ? `${label} (${formatOdds(odds)})` : formatOdds(odds)}
    </button>
  )
}
