import { create } from 'zustand'
import { fetchCollection, addOwnedCard, removeOwnedCard } from '../api/client'
import { useCurrentUser } from './currentUser'

function fromOwnedCardOut(owned) {
  return {
    ownedId: owned.id,
    cardId: owned.card.id,
    category: owned.category,
    name: owned.card.name,
    setName: owned.card.set_name,
    cardNumber: owned.card.card_number,
    grade: owned.card.grade,
    rarity: owned.card.rarity,
    imageUrl: owned.card.image_url,
    pulledValue: owned.pulled_value,
    currentValue: owned.current_value,
    pulledAt: owned.pulled_at,
  }
}

export const useTcgCollection = create((set) => ({
  ownedCards: [],
  lastPull: null,

  loadCollection: async (userId) => {
    try {
      const owned = await fetchCollection(userId)
      set({ ownedCards: owned.map(fromOwnedCardOut) })
    } catch (error) {
      console.error('Failed to load collection:', error)
    }
  },

  clearCollection: () => set({ ownedCards: [], lastPull: null }),

  recordPull: async (card, packPrice, kept, category) => {
    set({ lastPull: { delta: card.market_value - packPrice, packPrice, cardValue: card.market_value } })

    if (!kept) return

    const userId = useCurrentUser.getState().user?.id
    if (!userId) return

    try {
      const owned = await addOwnedCard(userId, { cardId: card.id, category })
      set((state) => ({ ownedCards: [fromOwnedCardOut(owned), ...state.ownedCards] }))
    } catch (error) {
      console.error('Failed to save pulled card:', error)
    }
  },

  removeCard: (ownedId) => {
    set((state) => ({
      ownedCards: state.ownedCards.filter((card) => card.ownedId !== ownedId),
    }))

    const userId = useCurrentUser.getState().user?.id
    if (userId) {
      removeOwnedCard(userId, ownedId).catch((error) =>
        console.error('Failed to remove card:', error),
      )
    }
  },

  fluctuateValues: () =>
    set((state) => ({
      ownedCards: state.ownedCards.map((card) => ({
        ...card,
        currentValue: Math.max(
          1,
          Math.round(card.currentValue * (1 + (Math.random() * 0.16 - 0.08)) * 100) / 100,
        ),
      })),
    })),
}))
