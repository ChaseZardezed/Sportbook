import { useBetSlip } from '../store/betSlip'
import { formatOdds } from '../lib/odds'
import { combinedDecimalOdds, decimalToAmerican } from '../lib/parlay'

const QUICK_STAKES = [10, 25, 50, 100]

function StakeInput({ value, onChange }) {
  return (
    <div className="mt-2 flex items-center gap-1 rounded border border-gray-700 bg-gray-950 px-2 py-1">
      <span className="text-xs text-gray-500">$</span>
      <input
        type="number"
        min="0"
        step="1"
        value={value || ''}
        onChange={(event) => onChange(Math.max(0, Number(event.target.value) || 0))}
        placeholder="Custom amount"
        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
      />
    </div>
  )
}

function LegHeader({ selection, onRemove }) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-gray-400">{selection.matchup}</p>
        <p className="font-semibold text-white">
          {selection.label} ({formatOdds(selection.odds)})
        </p>
      </div>
      <button type="button" onClick={onRemove} className="text-gray-500 hover:text-white">
        ✕
      </button>
    </div>
  )
}

function StraightBetRow({ selection }) {
  const removeSelection = useBetSlip((state) => state.removeSelection)
  const setStake = useBetSlip((state) => state.setStake)

  return (
    <div className="rounded border border-gray-800 bg-gray-900 p-3">
      <LegHeader selection={selection} onRemove={() => removeSelection(selection.id)} />
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
      <StakeInput value={selection.stake} onChange={(amount) => setStake(selection.id, amount)} />
    </div>
  )
}

function ParlayLegRow({ selection }) {
  const removeSelection = useBetSlip((state) => state.removeSelection)

  return (
    <div className="rounded border border-gray-800 bg-gray-900 p-3">
      <LegHeader selection={selection} onRemove={() => removeSelection(selection.id)} />
    </div>
  )
}

export default function BetSlip() {
  const selectionsMap = useBetSlip((state) => state.selections)
  const clear = useBetSlip((state) => state.clear)
  const parlayStake = useBetSlip((state) => state.parlayStake)
  const setParlayStake = useBetSlip((state) => state.setParlayStake)
  const selections = Object.values(selectionsMap)

  const isParlay = selections.length > 1
  const straightTotal = selections.reduce((sum, s) => sum + (s.stake || 0), 0)

  const parlayDecimalOdds = isParlay ? combinedDecimalOdds(selections) : 1
  const parlayAmericanOdds = isParlay ? decimalToAmerican(parlayDecimalOdds) : 0
  const parlayPayout = parlayStake * parlayDecimalOdds

  const canPlaceBet = isParlay ? parlayStake > 0 : straightTotal > 0

  return (
    <div className="flex flex-col rounded-lg border border-gray-800 bg-gray-950">
      <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
        <h2 className="font-bold text-white">
          {isParlay ? `Parlay (${selections.length} legs)` : 'Bet Slip'}
          {!isParlay && selections.length > 0 && ` (${selections.length})`}
        </h2>
        {selections.length > 0 && (
          <button type="button" onClick={clear} className="text-xs text-gray-400 hover:text-white">
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-2 p-3">
        {selections.length === 0 ? (
          <p className="p-4 text-center text-sm text-gray-500">
            Click any odds to add it to your bet slip
          </p>
        ) : isParlay ? (
          selections.map((selection) => <ParlayLegRow key={selection.id} selection={selection} />)
        ) : (
          selections.map((selection) => <StraightBetRow key={selection.id} selection={selection} />)
        )}
      </div>

      {isParlay && (
        <div className="border-t border-gray-800 p-3">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-gray-400">Combined Odds</span>
            <span className="font-semibold text-white">{formatOdds(parlayAmericanOdds)}</span>
          </div>
          <div className="flex gap-2">
            {QUICK_STAKES.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setParlayStake(amount)}
                className={`flex-1 rounded border px-2 py-1 text-xs font-medium ${
                  parlayStake === amount
                    ? 'border-purple-500 bg-purple-600/20 text-white'
                    : 'border-gray-700 text-gray-300 hover:border-purple-500'
                }`}
              >
                ${amount}
              </button>
            ))}
          </div>
          <StakeInput value={parlayStake} onChange={setParlayStake} />
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-gray-400">Payout</span>
            <span className="font-semibold text-white">${parlayPayout.toFixed(2)}</span>
          </div>
        </div>
      )}

      {selections.length > 0 && (
        <div className="border-t border-gray-800 p-3">
          <button
            type="button"
            disabled={!canPlaceBet}
            className="w-full rounded bg-purple-600 py-2 font-semibold text-white hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isParlay
              ? `Place Parlay ($${parlayStake.toFixed(2)})`
              : `Place Bet ($${straightTotal.toFixed(2)})`}
          </button>
        </div>
      )}
    </div>
  )
}
