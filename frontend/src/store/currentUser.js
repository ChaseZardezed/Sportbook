import { create } from 'zustand'

const STORAGE_KEY = 'currentUser'

function getStoredUser() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export const useCurrentUser = create((set) => ({
  user: getStoredUser(),

  login: (user) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    set({ user })
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY)
    set({ user: null })
  },
}))
