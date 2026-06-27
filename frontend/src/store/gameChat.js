import { create } from 'zustand'

export const useGameChat = create((set) => ({
  openMatch: null,

  openChat: (match) => set({ openMatch: match }),
  closeChat: () => set({ openMatch: null }),
}))
