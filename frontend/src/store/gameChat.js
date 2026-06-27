import { create } from 'zustand'
import { useStatsPanel } from './statsPanel'

export const useGameChat = create((set) => ({
  openMatch: null,

  openChat: (match) => set({ openMatch: match }),
  closeChat: () => set({ openMatch: null }),
  toggleChat: (match) =>
    set((state) => {
      if (state.openMatch?.matchId === match.matchId) {
        return { openMatch: null }
      }
      useStatsPanel.getState().closeStats()
      return { openMatch: match }
    }),
}))
