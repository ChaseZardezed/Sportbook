export function formatOdds(value) {
  return value > 0 ? `+${value}` : `${value}`
}

export function findMarket(markets, type) {
  return markets.find((market) => market.market_type === type)
}
