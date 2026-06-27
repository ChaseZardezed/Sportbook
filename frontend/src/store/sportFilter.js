import { create } from 'zustand'

export const useSportFilter = create((set) => ({
  selectedSport: null,
  selectSport: (sport) => set({ selectedSport: sport }),
}))
