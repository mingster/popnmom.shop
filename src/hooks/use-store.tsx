import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';

import { Store } from 'prisma/prisma-client';
import getStore from '@/actions/get-store';
/*
interface PersistedStore {
  data: Store | null;
  isLoading: boolean;
  error: null | string;
  load: () => void;
}
export const useStore = create<PersistedStore>()(
  
  persist(
    (set) => ({
      data: null,
      isLoading: false,
      error: null,
      load: async () => {
        try {
          set({ isLoading: true });
          const response = await getStore();
          set({ isLoading: false, data: response });
        } catch (err) {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'store-storage', // name of item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default the 'localStorage' is used
      //partialize: (state) => ({ data: state.data }),
    },
  ),
  
);
export default useStore;

*/

/*
      addABear: () => set({ bears: get().bears + 1 }),
  
          data: [],
  isLoading: false,
  error: null,

  load: async () => {
    try {
      set({ isLoading: true });
      const response = await getStore();
      set({ isLoading: false, data: response });
    } catch (err) {
      set({ isLoading: false });
    }
  },

        
        */

export default function useStore({ children }: { children: React.ReactNode }) {
  return <></>;
}
