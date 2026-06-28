import { create } from 'zustand'
import { updateBalance } from '../api/client'
import { useCurrentUser } from './currentUser'

// Reads useCurrentUser via getState() instead of a hook, since this is a
// plain function (not a component) called from inside another store's
// actions. This creates a circular import between balance.js and
// currentUser.js, which is safe here because the cross-reference only
// happens inside function bodies - never evaluated at module load time.
function syncDelta(delta) {
  const userId = useCurrentUser.getState().user?.id
  if (userId) {
    // Fire-and-forget: the local balance updates immediately below
    // regardless of whether this network call succeeds, so the UI never
    // blocks on it. A failure just gets logged - balance will resync on
    // next login/refresh via App.jsx's hydration effect.
    updateBalance(userId, delta).catch((error) => console.error('Failed to sync balance:', error))
  }
}

export const useBalance = create((set) => ({
  balance: 0,

  // Used on login/logout/refresh to hydrate from the server's value,
  // bypassing syncDelta since there's nothing to persist - it's already
  // the source of truth.
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
