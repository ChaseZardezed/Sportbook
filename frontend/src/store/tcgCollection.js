import { create } from 'zustand'
import {
  fetchCollection,
  addOwnedCard,
  removeOwnedCard,
  fetchCardHistory,
  addCardHistory,
} from '../api/client'
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

// Backend's CardHistoryOut nests the card the same way OwnedCardOut does;
// flattens it into the shape CollectionSidebar's history panel expects.
function fromCardHistoryOut(entry) {
  return {
    id: entry.id,
    name: entry.card.name,
    imageUrl: entry.card.image_url,
    rarity: entry.card.rarity,
    value: entry.value,
    action: entry.action,
    timestamp: entry.created_at,
  }
}

export const useTcgCollection = create((set) => ({
  ownedCards: [],
  lastPull: null,
  // Sell/Ship history for the sidebar's history panel - persisted server-side
  // via /users/{id}/card-history, so it survives logout/refresh.
  history: [],

  loadCollection: async (userId) => {
    try {
      const owned = await fetchCollection(userId)
      set({ ownedCards: owned.map(fromOwnedCardOut) })
    } catch (error) {
      console.error('Failed to load collection:', error)
    }
  },

  loadHistory: async (userId) => {
    try {
      const entries = await fetchCardHistory(userId)
      set({ history: entries.map(fromCardHistoryOut) })
    } catch (error) {
      console.error('Failed to load card history:', error)
    }
  },

  clearCollection: () => set({ ownedCards: [], lastPull: null, history: [] }),

  // Called for every pull regardless of outcome (kept or sold) - lastPull
  // is just UI flavor (was used for a "last pull vs cost" banner, now mostly
  // unused since that banner was removed). Kept pulls join the collection;
  // sold-on-pull cards skip the collection but still log a sold history entry
  // (this is the only place a card is sold without ever going through
  // MyCollection's Sell button, since it never entered ownedCards).
  recordPull: async (card, packPrice, kept, category) => {
    set({ lastPull: { delta: card.market_value - packPrice, packPrice, cardValue: card.market_value } })

    const userId = useCurrentUser.getState().user?.id

    if (!kept) {
      set((state) => ({
        history: [
          {
            id: `pending-${Date.now()}`,
            name: card.name,
            imageUrl: card.image_url,
            rarity: card.rarity,
            value: card.market_value,
            action: 'sold',
            timestamp: new Date().toISOString(),
          },
          ...state.history,
        ].slice(0, 100),
      }))

      if (userId) {
        addCardHistory(userId, { cardId: card.id, category, action: 'sold', value: card.market_value }).catch(
          (error) => console.error('Failed to record card history:', error),
        )
      }
      return
    }

    if (!userId) return

    try {
      const owned = await addOwnedCard(userId, { cardId: card.id, category })
      set((state) => ({ ownedCards: [fromOwnedCardOut(owned), ...state.ownedCards] }))
    } catch (error) {
      console.error('Failed to save pulled card:', error)
    }
  },

  // action is 'sold' or 'shipped' - just labels the history entry, doesn't
  // change removal behavior (selling and shipping both just drop the card).
  removeCard: (ownedId, action = 'sold') => {
    const card = useTcgCollection.getState().ownedCards.find((owned) => owned.ownedId === ownedId)

    // Optimistic local entry so the sidebar updates immediately; replaced
    // wholesale once loadHistory next runs (e.g. on a future page load).
    const optimisticEntry = card && {
      id: `pending-${ownedId}`,
      name: card.name,
      imageUrl: card.imageUrl,
      rarity: card.rarity,
      value: card.currentValue,
      action,
      timestamp: new Date().toISOString(),
    }

    set((state) => ({
      ownedCards: state.ownedCards.filter((owned) => owned.ownedId !== ownedId),
      history: optimisticEntry ? [optimisticEntry, ...state.history].slice(0, 100) : state.history,
    }))

    const userId = useCurrentUser.getState().user?.id
    if (!userId) return

    removeOwnedCard(userId, ownedId).catch((error) =>
      console.error('Failed to remove card:', error),
    )

    if (card) {
      addCardHistory(userId, { cardId: card.cardId, category: card.category, action, value: card.currentValue }).catch(
        (error) => console.error('Failed to record card history:', error),
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
