import { create } from 'zustand'

export const useBetSlip = create((set) => ({
  selections: {},
  isOpen: true,

  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),

  toggleSelection: (selection) =>
    set((state) => {
      const { selections } = state
      if (selections[selection.id]) {
        const { [selection.id]: _removed, ...rest } = selections
        return { selections: rest }
      }
      return { selections: { ...selections, [selection.id]: { ...selection, stake: 0 } } }
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

  clear: () => set({ selections: {} }),
}))
