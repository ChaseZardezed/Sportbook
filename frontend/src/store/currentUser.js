import { create } from 'zustand'

const STORAGE_KEY = 'currentUser'

// user is whatever UserOut the backend returned at login time - a snapshot,
// not live data. In particular user.balance can go stale immediately after
// login, since balance/collection/bets/unopened-packs are tracked in their
// own stores and re-fetched separately (see App.jsx's useHydrateUserData).
function getStoredUser() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export const useCurrentUser = create((set) => ({
  // Read synchronously from localStorage at module load, so a page refresh
  // while logged in doesn't flash the logged-out state before React mounts.
  user: getStoredUser(),

  // Deliberately doesn't load balance/collection/etc itself - App.jsx's
  // useHydrateUserData effect reacts to `user` changing and fetches fresh
  // data from the server instead of trusting this snapshot's balance field.
  login: (user) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    set({ user })
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY)
    set({ user: null })
  },
}))
