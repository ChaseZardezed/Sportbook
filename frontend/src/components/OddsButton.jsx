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
          ? 'border-purple-500 bg-purple-600/20 text-gray-900 dark:text-white'
          : 'border-gray-300 bg-gray-50 text-gray-700 hover:border-purple-500 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:text-white'
      }`}
    >
      {label ? `${label} (${formatOdds(odds)})` : formatOdds(odds)}
    </button>
  )
}
