import { create } from 'zustand'
import { updateBalance } from '../api/client'
import { useCurrentUser } from './currentUser'

function syncDelta(delta) {
  const userId = useCurrentUser.getState().user?.id
  if (userId) {
    updateBalance(userId, delta).catch((error) => console.error('Failed to sync balance:', error))
  }
}

export const useBalance = create((set) => ({
  balance: 0,

  setBalance: (balance) => set({ balance }),

  deduct: (amount) => {
    syncDelta(-amount)
    set((state) => ({ balance: state.balance - amount }))
  },

  credit: (amount) => {
    syncDelta(amount)
    set((state) => ({ balance: state.balance + amount }))
  },
}))
