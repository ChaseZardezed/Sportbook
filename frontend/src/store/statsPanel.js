import { create } from 'zustand'
import { useGameChat } from './gameChat'

export const useStatsPanel = create((set) => ({
  openMatch: null,

  closeStats: () => set({ openMatch: null }),
  toggleStats: (match) =>
    set((state) => {
      if (state.openMatch?.matchId === match.matchId) {
        return { openMatch: null }
      }
      useGameChat.getState().closeChat()
      return { openMatch: match }
    }),
}))
