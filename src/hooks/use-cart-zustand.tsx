import { toast } from 'react-hot-toast';
import { create, StateCreator, StoreMutatorIdentifier } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { CartItem } from '@/types/types';
//import { AlertTriangle } from 'lucide-react';

interface CartStore {
  items: CartItem[];
  addItem: (data: CartItem) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],

      addItem: (data: CartItem) => {
        /*
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === data.id);
        if (existingItem) {
          //return toast('購物車已有同樣的產品喔');
          //replace the existing item with the new one
        }
        */

        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === data.id);

        if (existingItem) {
          //return toast('購物車已有同樣的產品喔');
          const newQuantity = (existingItem.quantity ?? 0) + 1;
          existingItem.quantity = newQuantity;

          //data.quantity = data.quantity + 1;

          //replace the existing item with the new one
          set({ items: [...get().items.filter((item) => item.name !== data.name)] }); //remove the old item
          set({ items: [...get().items, data] }); //add the new item

          //toast.success('Item added to cart.');
          toast.success('更新成功');
        } else {
          //add new item
          data.quantity = 1;
          set({ items: [...get().items, data] });
          //toast.success('Item added to cart.');
          toast.success('新增成功');
        }
      },
      removeItem: (id: string) => {
        set({ items: [...get().items.filter((item) => item.id !== id)] });
        //toast.success('Item removed from cart.');
        toast.success('移除成功');
      },
      removeAll: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useCart;
