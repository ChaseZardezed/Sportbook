import { create } from 'zustand'
import { fetchCollection, addOwnedCard, removeOwnedCard } from '../api/client'
import { useCurrentUser } from './currentUser'

// Backend's OwnedCardOut nests the card under `card` (snake_case fields);
// flattens it into the shape MyCollection/CollectionSidebar/etc. expect.
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
    statsImageUrl: owned.card.stats_image_url,
    stats: owned.card.stats,
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

  // Called for every pull regardless of outcome (kept or sold) - lastPull
  // is just UI flavor (was used for a "last pull vs cost" banner, now mostly
  // unused since that banner was removed). Only persists to the collection
  // when kept=true; selling never adds a row here.
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

  // Cosmetic market simulation only - called on a timer from
  // CollectionSidebar. currentValue drift is never persisted to the
  // backend, so it resets to pulledValue on next login/refresh.
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
