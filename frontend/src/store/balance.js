import { create } from 'zustand'

export const useBalance = create((set) => ({
  balance: 1000,

  deduct: (amount) => set((state) => ({ balance: state.balance - amount })),
  credit: (amount) => set((state) => ({ balance: state.balance + amount })),
}))
