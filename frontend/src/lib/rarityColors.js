export const RARITY_RANK = ['Common', 'Uncommon', 'Rare', 'Ultra Rare', 'Secret Rare', '1st Edition']

export const RARITY_COLORS = {
  Common: { glow: 'rgba(156,163,175,0.55)', border: 'border-gray-400', text: 'text-gray-300' },
  Uncommon: { glow: 'rgba(34,197,94,0.55)', border: 'border-green-500', text: 'text-green-400' },
  Rare: { glow: 'rgba(59,130,246,0.55)', border: 'border-blue-500', text: 'text-blue-400' },
  'Ultra Rare': { glow: 'rgba(168,85,247,0.55)', border: 'border-purple-500', text: 'text-purple-400' },
  'Secret Rare': { glow: 'rgba(245,158,11,0.55)', border: 'border-amber-500', text: 'text-amber-400' },
  '1st Edition': { glow: 'rgba(239,68,68,0.55)', border: 'border-red-500', text: 'text-red-400' },
}

export const TIER_COLORS = {
  'Bronze Slab': { glow: 'rgba(249,115,22,0.45)', border: 'border-orange-500', text: 'text-orange-300' },
  'Silver Slab': { glow: 'rgba(156,163,175,0.45)', border: 'border-gray-400', text: 'text-gray-300' },
  'Gold Slab': { glow: 'rgba(245,158,11,0.45)', border: 'border-amber-500', text: 'text-amber-300' },
  'Platinum Slab': { glow: 'rgba(20,184,166,0.45)', border: 'border-teal-500', text: 'text-teal-300' },
  'Diamond Slab': { glow: 'rgba(168,85,247,0.45)', border: 'border-purple-500', text: 'text-purple-300' },
}

export function rarityColor(rarity) {
  return RARITY_COLORS[rarity] ?? RARITY_COLORS.Common
}

export function tierColor(tierName) {
  return TIER_COLORS[tierName] ?? TIER_COLORS['Bronze Slab']
}

// The highest-ranked rarity a given pack tier can pull, regardless of its odds %.
export function getBestRarity(rarityOdds) {
  return Object.keys(rarityOdds).reduce((best, rarity) =>
    RARITY_RANK.indexOf(rarity) > RARITY_RANK.indexOf(best) ? rarity : best,
  )
}
