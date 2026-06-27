import { useState } from 'react'
import { useBetSlip } from '../store/betSlip'
import { usePlacedBets } from '../store/placedBets'
import { useBalance } from '../store/balance'
import { formatOdds } from '../lib/odds'
import { americanToDecimal, combinedDecimalOdds, decimalToAmerican } from '../lib/parlay'

const QUICK_STAKES = [10, 25, 50, 100]

function StakeInput({ value, onChange }) {
  return (
    <div className="mt-2 flex items-center gap-1 rounded border border-gray-300 bg-gray-50 px-2 py-1 dark:border-gray-700 dark:bg-gray-950">
      <span className="text-xs text-gray-500">$</span>
      <input
        type="number"
        min="0"
        step="1"
        value={value || ''}
        onChange={(event) => onChange(Math.max(0, Number(event.target.value) || 0))}
        placeholder="Custom amount"
        className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-600 dark:text-white"
      />
    </div>
  )
}

function LegHeader({ selection, onRemove }) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-gray-400">{selection.matchup}</p>
        <p className="font-semibold text-gray-900 dark:text-white">
          {selection.label} ({formatOdds(selection.odds)})
        </p>
      </div>
      <button type="button" onClick={onRemove} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
        ✕
      </button>
    </div>
  )
}

function StraightBetRow({ selection }) {
  const removeSelection = useBetSlip((state) => state.removeSelection)
  const setStake = useBetSlip((state) => state.setStake)

  return (
    <div className="rounded border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
      <LegHeader selection={selection} onRemove={() => removeSelection(selection.id)} />
      <div className="mt-2 flex gap-2">
        {QUICK_STAKES.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => setStake(selection.id, amount)}
            className={`flex-1 rounded border px-2 py-1 text-xs font-medium ${
              selection.stake === amount
                ? 'border-purple-500 bg-purple-600/20 text-gray-900 dark:text-white'
                : 'border-gray-300 text-gray-600 hover:border-purple-500 dark:border-gray-700 dark:text-gray-300'
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
    <div className="rounded border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
      <LegHeader selection={selection} onRemove={() => removeSelection(selection.id)} />
    </div>
  )
}

function PlacedBetRow({ bet }) {
  return (
    <div className="rounded border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <span className="rounded bg-purple-600/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-purple-400">
          {bet.type}
        </span>
        <span className="text-xs text-gray-500">
          {new Date(bet.placedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
        </span>
      </div>
      <div className="mt-2 space-y-1">
        {bet.legs.map((leg, index) => (
          <p key={index} className="text-sm text-gray-300">
            {leg.label} <span className="text-gray-500">({formatOdds(leg.odds)})</span>
          </p>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-2 text-sm">
        <span className="text-gray-400">
          ${bet.stake.toFixed(2)} @ {formatOdds(bet.odds)}
        </span>
        <span className="font-semibold text-gray-900 dark:text-white">Pays ${bet.payout.toFixed(2)}</span>
      </div>
      <button
        type="button"
        disabled
        title="Cash out coming soon"
        className="mt-2 w-full rounded border border-purple-500 bg-purple-600/20 py-1.5 text-xs font-semibold text-purple-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Cash Out ${(bet.stake + (bet.payout - bet.stake) * 0.7).toFixed(2)}
      </button>
    </div>
  )
}

export default function BetSlip() {
  const [tab, setTab] = useState('slip')

  const selectionsMap = useBetSlip((state) => state.selections)
  const clear = useBetSlip((state) => state.clear)
  const parlayStake = useBetSlip((state) => state.parlayStake)
  const setParlayStake = useBetSlip((state) => state.setParlayStake)
  const selections = Object.values(selectionsMap)

  const placedBets = usePlacedBets((state) => state.placedBets)
  const placeBet = usePlacedBets((state) => state.placeBet)

  const balance = useBalance((state) => state.balance)
  const deduct = useBalance((state) => state.deduct)

  const isParlay = selections.length > 1
  const straightTotal = selections.reduce((sum, s) => sum + (s.stake || 0), 0)

  const parlayDecimalOdds = isParlay ? combinedDecimalOdds(selections) : 1
  const parlayAmericanOdds = isParlay ? decimalToAmerican(parlayDecimalOdds) : 0
  const parlayPayout = parlayStake * parlayDecimalOdds

  const stakeToPlace = isParlay ? parlayStake : straightTotal
  const canPlaceBet = stakeToPlace > 0 && stakeToPlace <= balance

  const handlePlaceBet = () => {
    if (!canPlaceBet) return

    const bet = isParlay
      ? {
          type: 'parlay',
          legs: selections.map(({ matchup, label, odds }) => ({ matchup, label, odds })),
          stake: parlayStake,
          odds: parlayAmericanOdds,
          payout: parlayPayout,
        }
      : {
          type: 'straight',
          legs: selections.map(({ matchup, label, odds }) => ({ matchup, label, odds })),
          stake: straightTotal,
          odds: selections[0].odds,
          payout: selections[0].stake * americanToDecimal(selections[0].odds),
        }

    placeBet(bet)
    deduct(stakeToPlace)
    clear(true)
    setTab('bets')
  }

  return (
    <div className="flex flex-col rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="flex border-b border-gray-200 dark:border-gray-800">
        <button
          type="button"
          onClick={() => setTab('slip')}
          className={`flex-1 px-4 py-3 text-sm font-bold ${
            tab === 'slip' ? 'border-b-2 border-purple-500 text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Bet Slip {selections.length > 0 && `(${selections.length})`}
        </button>
        <button
          type="button"
          onClick={() => setTab('bets')}
          className={`flex-1 px-4 py-3 text-sm font-bold ${
            tab === 'bets' ? 'border-b-2 border-purple-500 text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          My Bets {placedBets.length > 0 && `(${placedBets.length})`}
        </button>
      </div>

      {tab === 'slip' ? (
        <>
          <div className="flex items-center justify-end px-4 py-2">
            {selections.length > 0 && (
              <button type="button" onClick={clear} className="text-xs text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-2 px-3 pb-3">
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
            <div className="border-t border-gray-200 dark:border-gray-800 p-3">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-gray-400">Combined Odds</span>
                <span className="font-semibold text-gray-900 dark:text-white">{formatOdds(parlayAmericanOdds)}</span>
              </div>
              <div className="flex gap-2">
                {QUICK_STAKES.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setParlayStake(amount)}
                    className={`flex-1 rounded border px-2 py-1 text-xs font-medium ${
                      parlayStake === amount
                        ? 'border-purple-500 bg-purple-600/20 text-gray-900 dark:text-white'
                        : 'border-gray-300 text-gray-600 hover:border-purple-500 dark:border-gray-700 dark:text-gray-300'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              <StakeInput value={parlayStake} onChange={setParlayStake} />
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-gray-400">Payout</span>
                <span className="font-semibold text-gray-900 dark:text-white">${parlayPayout.toFixed(2)}</span>
              </div>
            </div>
          )}

          {selections.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-800 p-3">
              {stakeToPlace > balance && (
                <p className="mb-2 text-center text-xs text-red-400">Insufficient balance</p>
              )}
              <button
                type="button"
                disabled={!canPlaceBet}
                onClick={handlePlaceBet}
                className="w-full rounded bg-purple-600 py-2 font-semibold text-white hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isParlay
                  ? `Place Parlay ($${parlayStake.toFixed(2)})`
                  : `Place Bet ($${straightTotal.toFixed(2)})`}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-2 p-3">
          {placedBets.length === 0 ? (
            <p className="p-4 text-center text-sm text-gray-500">No bets placed yet</p>
          ) : (
            placedBets.map((bet) => <PlacedBetRow key={bet.id} bet={bet} />)
          )}
        </div>
      )}
    </div>
  )
}
