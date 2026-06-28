import { useEffect, useRef, useState } from 'react'
import { rollRarity, pickCardOfRarity } from '../../lib/rng'
import { rarityColor, tierColor, getBestRarity } from '../../lib/rarityColors'
import { useBalance } from '../../store/balance'
import { useTcgCollection } from '../../store/tcgCollection'
import { useUnopenedPacks } from '../../store/unopenedPacks'
import BoltIcon from '../icons/BoltIcon'

const BUILD_UP_MS = 1800
const FLIP_MS = 1100

export default function PackOpeningFlow({ tier, onDone, onBack, resumePack }) {
  const [stage, setStage] = useState(resumePack ? 'waiting' : 'ready') // ready | revealing | waiting | result
  const [card, setCard] = useState(resumePack ? resumePack.card : null)
  const [flipped, setFlipped] = useState(false)
  const [showFlash, setShowFlash] = useState(false)
  const [confirming, setConfirming] = useState(false)

  const category = resumePack ? resumePack.category : tier.category

  const balance = useBalance((state) => state.balance)
  const deduct = useBalance((state) => state.deduct)
  const credit = useBalance((state) => state.credit)
  const recordPull = useTcgCollection((state) => state.recordPull)
  const addUnopenedPack = useUnopenedPacks((state) => state.addUnopenedPack)
  const removeUnopenedPack = useUnopenedPacks((state) => state.removeUnopenedPack)

  // Tracks the in-flight (or already-resolved) unopened-pack record for this
  // purchase, so Sell/Keep can clear it once the pull is finally resolved.
  const unopenedPackRef = useRef(resumePack ? Promise.resolve(resumePack) : null)

  // Mirrors current stage/card for the unmount cleanup below, since that
  // closure only captures values from when the effect first ran.
  const latest = useRef({ stage, card })
  latest.current = { stage, card }
  const resolvedRef = useRef(false)

  useEffect(() => {
    return () => {
      const { stage: lastStage, card: lastCard } = latest.current
      // If the card was already revealed but the user backed out before
      // choosing Sell/Keep, default to keeping it in the collection rather
      // than leaving it stuck as an unopened pack.
      if (lastStage === 'result' && lastCard && !resolvedRef.current) {
        recordPull(lastCard, tier.price, true, category)
        unopenedPackRef.current?.then((entry) => {
          if (entry) removeUnopenedPack(entry.id)
        })
      }
    }
  }, [])

  const handleConfirmOpen = () => {
    if (balance < tier.price) return
    deduct(tier.price)
    setConfirming(false)

    const rarity = rollRarity(tier.rarity_odds)
    const pulledCard = pickCardOfRarity(tier.cards, rarity)
    setCard(pulledCard)
    setStage('revealing')
    setTimeout(() => setStage('waiting'), BUILD_UP_MS)

    // Persist immediately so an abandoned pull (closed tab, navigated away
    // before flipping) shows up under Unopened Packs instead of being lost.
    unopenedPackRef.current = addUnopenedPack(tier, pulledCard, category)
  }

  const handleFlip = () => {
    if (stage !== 'waiting') return
    setFlipped(true)
    setTimeout(() => setShowFlash(true), FLIP_MS / 2)
    setTimeout(() => setStage('result'), FLIP_MS)
  }

  // Awaits the create-call's promise (it may still be in flight if Sell/Keep
  // is clicked fast) before deleting by the real server-assigned id.
  // Safe to call when resuming too, since unopenedPackRef is pre-resolved
  // to resumePack in that case.
  const resolveUnopenedPack = async () => {
    const entry = await unopenedPackRef.current
    if (entry) removeUnopenedPack(entry.id)
  }

  const handleSell = () => {
    resolvedRef.current = true
    credit(card.market_value)
    recordPull(card, tier.price, false, category)
    resolveUnopenedPack()
    onDone()
  }

  const handleKeep = () => {
    resolvedRef.current = true
    recordPull(card, tier.price, true, category)
    resolveUnopenedPack()
    onDone()
  }

  const colors = card ? rarityColor(card.rarity) : null
  const isBestPull = card ? card.rarity === getBestRarity(tier.rarity_odds) : false
  // Hide the true rarity color/name while revealing unless it's the tier's
  // best possible pull — otherwise stay themed to the pack tier itself.
  const revealColors = isBestPull ? colors : tierColor(tier.name)
  const tierStyle = tierColor(tier.name)

  return (
    <div className="flex flex-col items-center gap-6 pb-10">
      <button type="button" onClick={onBack} className="self-start text-sm text-gray-400 hover:text-gray-900 dark:hover:text-white">
        ← Back to Store
      </button>

      <h1
        className={`text-lg font-bold ${
          stage === 'ready' ? 'text-gray-900 dark:text-white' : flipped ? colors.text : revealColors.text
        }`}
      >
        {stage === 'ready' && 'Ready to Open'}
        {stage === 'revealing' && (isBestPull ? `${card.rarity} Pull!` : 'Opening…')}
        {stage === 'waiting' && !flipped && (isBestPull ? `${card.rarity} Pull!` : 'Tap to Reveal')}
        {flipped && `${card.rarity} Pull!`}
      </h1>

      <div className="relative" style={{ perspective: '1200px' }}>
        <div
          onClick={handleFlip}
          className={`relative h-72 w-52 transition-transform duration-1000 ease-out [transform-style:preserve-3d] ${
            flipped ? '[transform:rotateY(180deg)]' : ''
          } ${stage === 'waiting' ? 'cursor-pointer' : ''}`}
        >
          {/* Front face: the pack */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-between rounded-xl border-2 bg-gradient-to-br from-gray-800 to-gray-950 p-6 [backface-visibility:hidden] ${
              stage === 'ready' ? tierStyle.border : revealColors.border
            } ${stage === 'revealing' ? 'animate-pulse-glow' : ''}`}
            style={
              stage === 'ready'
                ? { boxShadow: `0 0 30px 8px ${tierStyle.glow}` }
                : stage === 'revealing' || stage === 'waiting'
                  ? { '--glow-color': revealColors.glow, boxShadow: `0 0 30px 8px ${revealColors.glow}` }
                  : undefined
            }
          >
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-300">Raw Card Pack</p>
              <p className="text-sm font-bold text-white">{tier.name}</p>
            </div>
            <BoltIcon
              className={`h-10 w-10 ${stage === 'ready' ? `${tierStyle.text}/60` : revealColors.text}`}
            />
            {stage === 'waiting' ? (
              <p className={`animate-pulse text-xs font-bold ${revealColors.text}`}>👆 Click to flip</p>
            ) : (
              <div className="rounded border border-white/20 bg-black/30 px-3 py-1">
                <p className="font-bold text-white">${tier.price.toFixed(0)}</p>
              </div>
            )}
          </div>

          {/* Back face: the card, pre-rotated so it lands right-side-up after the flip */}
          {card && (
            <div
              className={`absolute inset-0 overflow-hidden rounded-lg border-2 bg-gray-200 text-gray-900 [backface-visibility:hidden] [transform:rotateY(180deg)] ${colors.border}`}
              style={{ boxShadow: `0 0 25px 6px ${colors.glow}` }}
            >
              {card.image_url ? (
                <img src={card.image_url} alt={card.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full flex-col">
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
              )}
            </div>
          )}
        </div>

        {showFlash && (
          <div
            className="pointer-events-none absolute inset-0 animate-flash-burst rounded-xl"
            style={{ backgroundColor: colors.glow }}
          />
        )}
      </div>

      {stage === 'ready' && !confirming && (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="rounded bg-green-600 px-8 py-2 font-bold text-white transition-colors hover:bg-green-500"
        >
          Open Pack
        </button>
      )}

      {stage === 'ready' && confirming && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-gray-400">
            Confirm purchase: open {tier.name} for{' '}
            <span className="font-bold text-gray-900 dark:text-white">${tier.price.toFixed(0)}</span>?
          </p>
          {balance < tier.price && <p className="text-xs text-red-400">Insufficient balance</p>}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="rounded border border-gray-300 px-6 py-2 text-sm font-bold text-gray-600 transition-colors hover:border-purple-500 dark:border-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={balance < tier.price}
              onClick={handleConfirmOpen}
              className="rounded bg-green-600 px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Confirm — ${tier.price.toFixed(0)}
            </button>
          </div>
        </div>
      )}

      {stage === 'result' && (
        <div className="w-72 animate-fade-in rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-800 dark:bg-gray-900">
          <p className={`text-xs ${colors.text}`}>{card.rarity}</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{card.name}</p>
          <p className="text-xs text-gray-500">
            {card.set_name} • {card.card_number} • PSA {card.grade}
          </p>
          <p className="mt-2 text-sm text-gray-400">
            Market Value <span className="font-bold text-green-400">${card.market_value.toFixed(0)}</span>
          </p>

          {card.stats && Object.keys(card.stats).length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-1.5 text-left text-xs">
              {Object.entries(card.stats).map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded border border-gray-200 bg-white px-2 py-1 dark:border-gray-800 dark:bg-gray-950"
                >
                  <span className="text-gray-500">{label}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{value}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-3 flex gap-3">
            <button
              type="button"
              onClick={handleSell}
              className="flex-1 rounded bg-green-700 py-2 text-sm font-bold text-white transition-colors hover:bg-green-600"
            >
              Sell — ${card.market_value.toFixed(0)}
            </button>
            <button
              type="button"
              onClick={handleKeep}
              className="flex-1 rounded border border-gray-300 py-2 text-sm font-bold text-gray-900 transition-colors hover:border-purple-500 dark:border-gray-700 dark:text-white"
            >
              Keep in Collection
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
