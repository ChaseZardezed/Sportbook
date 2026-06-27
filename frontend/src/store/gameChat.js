import { create } from 'zustand'

export const useGameChat = create((set) => ({
  openMatch: null,

  openChat: (match) => set({ openMatch: match }),
  closeChat: () => set({ openMatch: null }),
  toggleChat: (match) =>
    set((state) => ({
      openMatch: state.openMatch?.matchId === match.matchId ? null : match,
    })),
}))
