const PROMOS = [
  {
    emoji: '🔥',
    title: 'Hot Parlay — up to 12x payout',
    subtitle: "Build a 3-leg parlay from tonight's featured games",
    cta: 'Build Parlay →',
  },
  {
    emoji: '⚡',
    title: 'Odds Boost — Chiefs ML +10%',
    subtitle: 'Boosted price available for the next 2 hours',
    cta: 'Claim Boost →',
  },
  {
    emoji: '🎁',
    title: '$50 Welcome Bonus',
    subtitle: 'Deposit $25 or more to unlock your bonus',
    cta: 'Deposit Now →',
  },
]

function PromoCard({ promo }) {
  return (
    <div className="flex min-w-[320px] items-center justify-between gap-3 rounded-lg border border-purple-500/40 bg-gradient-to-r from-purple-600/20 to-purple-600/5 px-4 py-3">
      <div>
        <p className="text-sm font-bold text-gray-900 dark:text-white">
          {promo.emoji} {promo.title}
        </p>
        <p className="text-xs text-gray-400">{promo.subtitle}</p>
      </div>
      <button
        type="button"
        className="shrink-0 rounded bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-500"
      >
        {promo.cta}
      </button>
    </div>
  )
}

export default function PromoBanner() {
  return (
    <div className="mx-6 mt-4 rounded-lg border border-gray-300 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
      <p className="mb-2 text-xs font-semibold uppercase text-gray-500">Promotions</p>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {PROMOS.map((promo) => (
          <PromoCard key={promo.title} promo={promo} />
        ))}
      </div>
    </div>
  )
}
