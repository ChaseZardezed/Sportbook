import { create } from 'zustand'
import { fetchUnopenedPacks, createUnopenedPack, removeUnopenedPack } from '../api/client'
import { useCurrentUser } from './currentUser'

function fromUnopenedPackOut(pack) {
  return {
    id: pack.id,
    category: pack.category,
    purchasedAt: pack.purchased_at,
    packTierId: pack.pack_tier.id,
    tierName: pack.pack_tier.name,
    tierPrice: pack.pack_tier.price,
    card: pack.card,
  }
}

export const useUnopenedPacks = create((set) => ({
  unopenedPacks: [],

  loadUnopenedPacks: async (userId) => {
    try {
      const packs = await fetchUnopenedPacks(userId)
      set({ unopenedPacks: packs.map(fromUnopenedPackOut) })
    } catch (error) {
      console.error('Failed to load unopened packs:', error)
    }
  },

  clearUnopenedPacks: () => set({ unopenedPacks: [] }),

  addUnopenedPack: async (tier, card, category) => {
    const userId = useCurrentUser.getState().user?.id
    if (!userId) return null

    try {
      const saved = await createUnopenedPack(userId, { packTierId: tier.id, cardId: card.id, category })
      const entry = fromUnopenedPackOut(saved)
      set((state) => ({ unopenedPacks: [entry, ...state.unopenedPacks] }))
      return entry
    } catch (error) {
      console.error('Failed to save unopened pack:', error)
      return null
    }
  },

  removeUnopenedPack: (unopenedId) => {
    set((state) => ({
      unopenedPacks: state.unopenedPacks.filter((pack) => pack.id !== unopenedId),
    }))

    const userId = useCurrentUser.getState().user?.id
    if (userId) {
      removeUnopenedPack(userId, unopenedId).catch((error) =>
        console.error('Failed to remove unopened pack:', error),
      )
    }
  },
}))
