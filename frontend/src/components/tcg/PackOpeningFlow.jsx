import { useState } from 'react'
import { rollRarity, pickCardOfRarity } from '../../lib/rng'
import { useBalance } from '../../store/balance'
import { useTcgCollection } from '../../store/tcgCollection'

export default function PackOpeningFlow({ tier, onDone, onBack }) {
  const [stage, setStage] = useState('ready') // ready | revealing | result
  const [card, setCard] = useState(null)

  const credit = useBalance((state) => state.credit)
  const recordPull = useTcgCollection((state) => state.recordPull)

  const handleOpen = () => {
    const rarity = rollRarity(tier.rarity_odds)
    const pulledCard = pickCardOfRarity(tier.cards, rarity)
    setCard(pulledCard)
    setStage('revealing')
    setTimeout(() => setStage('result'), 1400)
  }

  const handleSell = () => {
    credit(card.market_value)
    recordPull(card, tier.price, false)
    onDone()
  }

  const handleKeep = () => {
    recordPull(card, tier.price, true)
    onDone()
  }

  return (
    <div className="flex flex-col items-center gap-6 py-10">
      <button type="button" onClick={onBack} className="self-start text-sm text-gray-400 hover:text-white">
        ← Back to Store
      </button>

      <h1 className="text-lg font-bold text-white">
        {stage === 'ready' && 'Ready to Open'}
        {stage === 'revealing' && `${card?.rarity} Pull!`}
        {stage === 'result' && `${card.rarity} Pull!`}
      </h1>

      {stage !== 'result' && (
        <div className="flex h-72 w-52 flex-col items-center justify-between rounded-xl border-2 border-orange-500 bg-gradient-to-br from-orange-700 to-orange-900 p-6 shadow-[0_0_30px_rgba(249,115,22,0.35)]">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-wide text-orange-200">Slab Pack</p>
            <p className="text-sm font-bold text-white">{tier.name}</p>
          </div>
          <span className="text-4xl text-orange-200/60">◈</span>
          <div className="rounded border border-orange-400 bg-black/30 px-3 py-1">
            <p className="font-bold text-orange-200">${tier.price.toFixed(0)}</p>
          </div>
        </div>
      )}

      {stage === 'ready' && (
        <button
          type="button"
          onClick={handleOpen}
          className="rounded bg-green-600 px-8 py-2 font-bold text-white hover:bg-green-500"
        >
          Open Pack
        </button>
      )}

      {stage === 'result' && (
        <>
          <div className="flex h-64 w-48 flex-col overflow-hidden rounded-lg border-2 border-blue-500 bg-gray-200 text-gray-900">
            <div className="flex items-center justify-between bg-blue-700 px-2 py-1 text-[10px] font-bold text-white">
              <span>PSA</span>
              <span className="rounded bg-blue-900 px-1">{card.rarity.toUpperCase()}</span>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center">
              <p className="text-lg font-bold text-gray-700">{card.name}</p>
              <p className="text-xs text-gray-500">{card.card_number}</p>
            </div>
            <div className="flex items-center justify-between bg-blue-700 px-2 py-1 text-xs font-bold text-white">
              <span>GRADE</span>
              <span>{card.grade}</span>
            </div>
            <div className="bg-gray-100 px-2 py-1 text-xs text-gray-700">{card.set_name}</div>
          </div>

          <div className="w-72 rounded-lg border border-gray-800 bg-gray-900 p-4 text-center">
            <p className="text-xs text-gray-500">{card.rarity}</p>
            <p className="text-lg font-bold text-white">{card.name}</p>
            <p className="text-xs text-gray-500">
              {card.set_name} • {card.card_number} • PSA {card.grade}
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Market Value <span className="font-bold text-green-400">${card.market_value.toFixed(0)}</span>
            </p>
            <div className="mt-3 flex gap-3">
              <button
                type="button"
                onClick={handleSell}
                className="flex-1 rounded bg-green-700 py-2 text-sm font-bold text-white hover:bg-green-600"
              >
                Sell — ${card.market_value.toFixed(0)}
              </button>
              <button
                type="button"
                onClick={handleKeep}
                className="flex-1 rounded border border-gray-700 py-2 text-sm font-bold text-white hover:border-purple-500"
              >
                Keep in Collection
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
