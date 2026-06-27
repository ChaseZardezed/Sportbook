export function americanToDecimal(odds) {
  return odds > 0 ? 1 + odds / 100 : 1 + 100 / Math.abs(odds)
}

export function decimalToAmerican(decimal) {
  if (decimal >= 2) return Math.round((decimal - 1) * 100)
  return Math.round(-100 / (decimal - 1))
}

export function combinedDecimalOdds(selections) {
  return selections.reduce((product, selection) => product * americanToDecimal(selection.odds), 1)
}
