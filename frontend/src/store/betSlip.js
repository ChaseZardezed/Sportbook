import { create } from 'zustand'

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
        return { selections: rest }
      }

      // Only one side of a given market (e.g. home ML vs away ML) can be
      // selected per match — taking a new side replaces the opposite one.
      const groupKey = `${selection.matchId}-${selection.marketType}`
      const withoutOppositeSide = Object.fromEntries(
        Object.entries(selections).filter(
          ([, existing]) => `${existing.matchId}-${existing.marketType}` !== groupKey,
        ),
      )

      // Auto-open the slip the first time a selection is added.
      const isFirstSelection = Object.keys(selections).length === 0

      return {
        selections: { ...withoutOppositeSide, [selection.id]: { ...selection, stake: 0 } },
        isOpen: isFirstSelection ? true : state.isOpen,
      }
    }),

  removeSelection: (id) =>
    set((state) => {
      const { [id]: _removed, ...rest } = state.selections
      return { selections: rest }
    }),

  setStake: (id, stake) =>
    set((state) => ({
      selections: {
        ...state.selections,
        [id]: { ...state.selections[id], stake },
      },
    })),

  setParlayStake: (stake) => set({ parlayStake: stake }),

  clear: () => set({ selections: {}, parlayStake: 0 }),
}))
