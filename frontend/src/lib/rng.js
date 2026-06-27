export function rollRarity(rarityOdds) {
  const entries = Object.entries(rarityOdds)
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0)
  let roll = Math.random() * total

  for (const [rarity, weight] of entries) {
    if (roll < weight) return rarity
    roll -= weight
  }

  return entries[entries.length - 1][0]
}

export function pickCardOfRarity(cards, rarity) {
  const pool = cards.filter((card) => card.rarity === rarity)
  return pool[Math.floor(Math.random() * pool.length)]
}
