import { create } from 'zustand'

export const useTcgCollection = create((set) => ({
  ownedCards: [],
  lastPull: null,

  recordPull: (card, packPrice, kept) =>
    set((state) => ({
      ownedCards: kept
        ? [
            {
              ownedId: crypto.randomUUID(),
              cardId: card.id,
              name: card.name,
              setName: card.set_name,
              cardNumber: card.card_number,
              grade: card.grade,
              rarity: card.rarity,
              pulledValue: card.market_value,
              currentValue: card.market_value,
              pulledAt: new Date().toISOString(),
            },
            ...state.ownedCards,
          ]
        : state.ownedCards,
      lastPull: { delta: card.market_value - packPrice, packPrice, cardValue: card.market_value },
    })),

  removeCard: (ownedId) =>
    set((state) => ({
      ownedCards: state.ownedCards.filter((card) => card.ownedId !== ownedId),
    })),

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
