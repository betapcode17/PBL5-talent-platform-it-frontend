// hook

import { create } from 'zustand'

type CounterStore = {
  count: number
  increment: () => void
  decrement: () => void
  setValue: (value: number) => void
}
// bat dau bang use + tinh nang  + ket thuc counter
export const useCountStore = create<CounterStore>((set, get) => {
  return {
    count: 0,
    increment() {
      set((state) => ({ count: state.count + 1 }))
    },

    decrement() {
      set((state) => ({ count: state.count - 1 }))
      console.log(get().count)
    },
    setValue(num) {
      set({ count: num })
    }
  }
})
