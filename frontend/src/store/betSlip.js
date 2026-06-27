import { create } from 'zustand'
import { americanToDecimal } from '../lib/parlay'

const ML_SPREAD_TYPES = new Set(['moneyline', 'spread'])

export const useBetSlip = create((set) => ({
  selections: {},
  isOpen: false,
  parlayStake: 0,

  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),

  toggleSelection: (selection) =>
    set((state) => {
      const { selections } = state

      // Toggling an already-selected pick removes it.
      if (selections[selection.id]) {
        const { [selection.id]: _removed, ...rest } = selections
        return { selections: rest, isOpen: Object.keys(rest).length === 0 ? false : state.isOpen }
      }

      // Only one side of a given market (e.g. home ML vs away ML) can be
      // selected per match — taking a new side replaces the opposite one.
      const groupKey = `${selection.matchId}-${selection.marketType}`
      let nextSelections = Object.fromEntries(
        Object.entries(selections).filter(
          ([, existing]) => `${existing.matchId}-${existing.marketType}` !== groupKey,
        ),
      )

      // Moneyline and spread on the same team are correlated — only keep
      // whichever is harder to hit (lower implied probability).
      if (ML_SPREAD_TYPES.has(selection.marketType) && selection.side) {
        const correlatedEntry = Object.entries(nextSelections).find(
          ([, existing]) =>
            existing.matchId === selection.matchId &&
            existing.side === selection.side &&
            ML_SPREAD_TYPES.has(existing.marketType),
        )

        if (correlatedEntry) {
          const [correlatedId, correlatedSelection] = correlatedEntry
          const newIsHarder =
            americanToDecimal(selection.odds) > americanToDecimal(correlatedSelection.odds)

          if (!newIsHarder) {
            // Existing pick is the harder (or equal) one — ignore this click.
            return {}
          }

          const { [correlatedId]: _removed, ...rest } = nextSelections
          nextSelections = rest
        }
      }

      // A favorite covering the spread and the opposing team winning outright
      // can never both happen — picking one invalidates the other outright.
      if (selection.marketType === 'spread' && selection.line < 0) {
        const contradictingMl = Object.entries(nextSelections).find(
          ([, existing]) =>
            existing.matchId === selection.matchId &&
            existing.marketType === 'moneyline' &&
            existing.side !== selection.side,
        )
        if (contradictingMl) {
          const [id] = contradictingMl
          const { [id]: _removed, ...rest } = nextSelections
          nextSelections = rest
        }
      }
      if (selection.marketType === 'moneyline') {
        const contradictingFavoriteSpread = Object.entries(nextSelections).find(
          ([, existing]) =>
            existing.matchId === selection.matchId &&
            existing.marketType === 'spread' &&
            existing.side !== selection.side &&
            existing.line < 0,
        )
        if (contradictingFavoriteSpread) {
          const [id] = contradictingFavoriteSpread
          const { [id]: _removed, ...rest } = nextSelections
          nextSelections = rest
        }
      }

      // Auto-open the slip the first time a selection is added.
      const isFirstSelection = Object.keys(selections).length === 0

      return {
        selections: { ...nextSelections, [selection.id]: { ...selection, stake: 0 } },
        isOpen: isFirstSelection ? true : state.isOpen,
      }
    }),

  removeSelection: (id) =>
    set((state) => {
      const { [id]: _removed, ...rest } = state.selections
      return { selections: rest, isOpen: Object.keys(rest).length === 0 ? false : state.isOpen }
    }),

  setStake: (id, stake) =>
    set((state) => ({
      selections: {
        ...state.selections,
        [id]: { ...state.selections[id], stake },
      },
    })),

  setParlayStake: (stake) => set({ parlayStake: stake }),

  clear: () => set({ selections: {}, parlayStake: 0, isOpen: false }),
}))
