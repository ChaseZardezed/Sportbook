export const RARITY_RANK = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythical']

export const RARITY_COLORS = {
  Common: { glow: 'rgba(156,163,175,0.55)', border: 'border-gray-400', text: 'text-gray-300' },
  Uncommon: { glow: 'rgba(34,197,94,0.55)', border: 'border-green-500', text: 'text-green-400' },
  Rare: { glow: 'rgba(59,130,246,0.55)', border: 'border-blue-500', text: 'text-blue-400' },
  'Epic': { glow: 'rgba(168,85,247,0.55)', border: 'border-purple-500', text: 'text-purple-400' },
  'Legendary': { glow: 'rgba(245,158,11,0.55)', border: 'border-amber-500', text: 'text-amber-400' },
  'Mythical': { glow: 'rgba(239,68,68,0.55)', border: 'border-red-500', text: 'text-red-400' },
}

export const TIER_COLORS = {
  'Bronze Raw Card': {
    icon: '🥉',
    glow: 'rgba(249,115,22,0.45)',
    border: 'border-orange-500',
    text: 'text-orange-300',
    gradient: 'from-orange-700 to-orange-900',
  },
  'Silver Raw Card': {
    icon: '🥈',
    glow: 'rgba(156,163,175,0.45)',
    border: 'border-gray-400',
    text: 'text-gray-300',
    gradient: 'from-gray-500 to-gray-700',
  },
  'Gold Raw Card': {
    icon: '🥇',
    glow: 'rgba(245,158,11,0.45)',
    border: 'border-amber-500',
    text: 'text-amber-300',
    gradient: 'from-amber-600 to-orange-800',
  },
  'Ruby Raw Card': {
    icon: '♦️',
    glow: 'rgba(239,68,68,0.45)',
    border: 'border-red-500',
    text: 'text-red-300',
    gradient: 'from-red-600 to-rose-900',
  },
  'Diamond Raw Card': {
    icon: '💎',
    glow: 'rgba(20,184,166,0.45)',
    border: 'border-teal-500',
    text: 'text-teal-300',
    gradient: 'from-teal-600 to-cyan-800',
  },
}

export function rarityColor(rarity) {
  return RARITY_COLORS[rarity] ?? RARITY_COLORS.Common
}

export function tierColor(tierName) {
  return TIER_COLORS[tierName] ?? TIER_COLORS['Bronze Raw Card']
}

// The highest-ranked rarity a given pack tier can pull, regardless of its odds %.
export function getBestRarity(rarityOdds) {
  return Object.keys(rarityOdds).reduce((best, rarity) =>
    RARITY_RANK.indexOf(rarity) > RARITY_RANK.indexOf(best) ? rarity : best,
  )
}
