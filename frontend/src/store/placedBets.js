import { create } from 'zustand'
import { fetchPlacedBets, createPlacedBet } from '../api/client'
import { useCurrentUser } from './currentUser'

// bet.legs holds a snapshot of {matchup, label, odds} per leg (straight bets
// have one leg, parlays have several) - see PlacedBet.legs on the backend
// for why this is a JSON blob instead of normalized rows.
function fromPlacedBetOut(bet) {
  return {
    id: bet.id,
    type: bet.type,
    legs: bet.legs,
    stake: bet.stake,
    odds: bet.odds,
    payout: bet.payout,
    placedAt: bet.placed_at,
  }
}

export const usePlacedBets = create((set) => ({
  placedBets: [],

  loadPlacedBets: async (userId) => {
    try {
      const bets = await fetchPlacedBets(userId)
      set({ placedBets: bets.map(fromPlacedBetOut) })
    } catch (error) {
      console.error('Failed to load placed bets:', error)
    }
  },

  clearPlacedBets: () => set({ placedBets: [] }),

  placeBet: async (bet) => {
    // Optimistic local entry so the UI updates immediately.
    const tempId = crypto.randomUUID()
    set((state) => ({
      placedBets: [{ ...bet, id: tempId, placedAt: new Date().toISOString() }, ...state.placedBets],
    }))

    const userId = useCurrentUser.getState().user?.id
    if (!userId) return

    try {
      const saved = await createPlacedBet(userId, bet)
      set((state) => ({
        placedBets: state.placedBets.map((entry) =>
          entry.id === tempId ? fromPlacedBetOut(saved) : entry,
        ),
      }))
    } catch (error) {
      console.error('Failed to save placed bet:', error)
    }
  },
}))
