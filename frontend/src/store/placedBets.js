import { create } from 'zustand'

export const usePlacedBets = create((set) => ({
  placedBets: [],

  placeBet: (bet) =>
    set((state) => ({
      placedBets: [{ ...bet, id: crypto.randomUUID(), placedAt: new Date().toISOString() }, ...state.placedBets],
    })),
}))
