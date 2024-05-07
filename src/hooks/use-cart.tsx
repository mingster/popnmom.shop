'use client';
//why use client - https://github.com/vercel/next.js/discussions/50955
/*
we are using React.context therefore use client is needed.....


The issue was I’m using a number of other libraries, such as Material UI, which don’t support server components yet 
(see mui/material-ui#34896 for this one). They need to add a 'use client' directive on their exports. Until each library you use 
do it itself, a workaround suggested by @bashonregardless in a comment is to have a file importing and reexporting them, and 
then only import from this file, not from node_modules.
*/

import * as React from 'react';
import useLocalStorage from './useLocalStorage';
import {CartItem} from '@/types/types';

/*
export interface Item {
  id: string;
  price: number;
  quantity?: number;
  itemTotal?: number;
  [key: string]: any;
}
*/
export interface InitialState {
  id: string;
  items: CartItem[];
  isEmpty: boolean;
  totalItems: number;
  totalUniqueItems: number;
  cartTotal: number;
  metadata?: Metadata;
}

export interface Metadata {
  [key: string]: any;
}

export interface CartProviderState extends InitialState {
  addItem: (item: CartItem, quantity?: number) => void;
  removeItem: (id: CartItem['id']) => void;
  updateItem: (id: CartItem['id'], payload: object) => void;
  setItems: (items: CartItem[]) => void;
  updateItemQuantity: (id: CartItem['id'], quantity: number) => void;
  emptyCart: () => void;
  getItem: (id: CartItem['id']) => any | undefined;
  inCart: (id: CartItem['id']) => boolean;
  clearCartMetadata: () => void;
  setCartMetadata: (metadata: Metadata) => void;
  updateCartMetadata: (metadata: Metadata) => void;
}

export type Actions =
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; id: CartItem['id'] }
  | {
      type: 'UPDATE_ITEM';
      id: CartItem['id'];
      payload: object;
    }
  | { type: 'EMPTY_CART' }
  | { type: 'CLEAR_CART_META' }
  | { type: 'SET_CART_META'; payload: Metadata }
  | { type: 'UPDATE_CART_META'; payload: Metadata };

export const initialState: any = {
  items: [],
  isEmpty: true,
  totalItems: 0,
  totalUniqueItems: 0,
  cartTotal: 0,
  metadata: {},
};

const CartContext = React.createContext<CartProviderState | undefined>(initialState);

export const createCartIdentifier = (len = 12) =>
  [...Array(len)].map(() => (~~(Math.random() * 36)).toString(36)).join('');

export const useCart = () => {
  const context = React.useContext(CartContext);

  if (!context) throw new Error('Expected to be wrapped in a CartProvider');

  return context;
};

function reducer(state: CartProviderState, action: Actions) {
  switch (action.type) {
    case 'SET_ITEMS':
      return generateCartState(state, action.payload);

    case 'ADD_ITEM': {
      const items = [...state.items, action.payload];

      return generateCartState(state, items);
    }

    case 'UPDATE_ITEM': {
      const items = state.items.map((item: CartItem) => {
        if (item.id !== action.id) return item;

        return {
          ...item,
          ...action.payload,
        };
      });

      return generateCartState(state, items);
    }

    case 'REMOVE_ITEM': {
      const items = state.items.filter((i: CartItem) => i.id !== action.id);

      return generateCartState(state, items);
    }

    case 'EMPTY_CART':
      return initialState;

    case 'CLEAR_CART_META':
      return {
        ...state,
        metadata: {},
      };

    case 'SET_CART_META':
      return {
        ...state,
        metadata: {
          ...action.payload,
        },
      };

    case 'UPDATE_CART_META':
      return {
        ...state,
        metadata: {
          ...state.metadata,
          ...action.payload,
        },
      };

    default:
      throw new Error('No action specified');
  }
}

const generateCartState = (state = initialState, items: CartItem[]) => {
  const totalUniqueItems = calculateUniqueItems(items);
  const isEmpty = totalUniqueItems === 0;

  return {
    ...initialState,
    ...state,
    items: calculateItemTotals(items),
    totalItems: calculateTotalItems(items),
    totalUniqueItems,
    cartTotal: calculateTotal(items),
    isEmpty,
  };
};

const calculateItemTotals = (items: CartItem[]) =>
  items.map((item) => ({
    ...item,
    itemTotal: item.price * item.quantity!,
  }));

const calculateTotal = (items: CartItem[]) =>
  items.reduce((total, item) => total + item.quantity! * item.price, 0);

const calculateTotalItems = (items: CartItem[]) => items.reduce((sum, item) => sum + item.quantity!, 0);

const calculateUniqueItems = (items: CartItem[]) => items.length;

export const CartProvider: React.FC<{
  children?: React.ReactNode;
  id?: string;
  defaultItems?: CartItem[];
  onSetItems?: (items: CartItem[]) => void;
  onItemAdd?: (payload: CartItem) => void;
  onItemUpdate?: (payload: object) => void;
  onItemRemove?: (id: CartItem['id']) => void;
  onEmptyCart?: () => void;
  storage?: (key: string, initialValue: string) => [string, (value: Function | string) => void];
  metadata?: Metadata;
}> = ({
  children,
  id: cartId,
  defaultItems = [],
  onSetItems,
  onItemAdd,
  onItemUpdate,
  onItemRemove,
  onEmptyCart,
  storage = useLocalStorage,
  metadata,
}) => {
  const id = cartId ? cartId : createCartIdentifier();

  const [savedCart, saveCart] = storage(
    cartId ? `react-use-cart-${id}` : `react-use-cart`,
    JSON.stringify({
      id,
      ...initialState,
      items: defaultItems,
      metadata,
    }),
  );

  const [state, dispatch] = React.useReducer(reducer, JSON.parse(savedCart));
  React.useEffect(() => {
    saveCart(JSON.stringify(state));
  }, [state, saveCart]);

  const setItems = (items: CartItem[]) => {
    dispatch({
      type: 'SET_ITEMS',
      payload: items.map((item) => ({
        ...item,
        quantity: item.quantity || 1,
      })),
    });

    onSetItems && onSetItems(items);
  };

  const addItem = (item: CartItem, quantity = 1) => {
    if (!item.id) throw new Error('You must provide an `id` for items');
    if (quantity <= 0) return;

    const currentItem = state.items.find((i: CartItem) => i.id === item.id);

    if (!currentItem && !item.hasOwnProperty('price'))
      throw new Error('You must pass a `price` for new items');

    //add item
    if (!currentItem) {
      const payload = { ...item, quantity };
      dispatch({ type: 'ADD_ITEM', payload });
      onItemAdd && onItemAdd(payload);
      return;
    }

    //update item
    //const payload = { ...item, quantity: currentItem.quantity};
    const payload = { ...item, quantity: currentItem.quantity + quantity };
    dispatch({
      type: 'UPDATE_ITEM',
      id: item.id,
      payload,
    });

    onItemUpdate && onItemUpdate(payload);
  };

  const updateItem = (id: CartItem['id'], payload: object) => {
    if (!id || !payload) {
      return;
    }

    dispatch({ type: 'UPDATE_ITEM', id, payload });

    onItemUpdate && onItemUpdate(payload);
  };

  const updateItemQuantity = (id: CartItem['id'], quantity: number) => {
    if (quantity <= 0) {
      onItemRemove && onItemRemove(id);

      dispatch({ type: 'REMOVE_ITEM', id });

      return;
    }

    const currentItem = state.items.find((item: CartItem) => item.id === id);

    if (!currentItem) throw new Error('No such item to update');

    const payload = { ...currentItem, quantity };

    dispatch({
      type: 'UPDATE_ITEM',
      id,
      payload,
    });

    onItemUpdate && onItemUpdate(payload);
  };

  const removeItem = (id: CartItem['id']) => {
    if (!id) return;

    dispatch({ type: 'REMOVE_ITEM', id });

    onItemRemove && onItemRemove(id);
  };

  const emptyCart = () => {
    dispatch({ type: 'EMPTY_CART' });

    onEmptyCart && onEmptyCart();
  };

  const getItem = (id: CartItem['id']) => state.items.find((i: CartItem) => i.id === id);

  const inCart = (id: CartItem['id']) => state.items.some((i: CartItem) => i.id === id);

  const clearCartMetadata = () => {
    dispatch({
      type: 'CLEAR_CART_META',
    });
  };

  const setCartMetadata = (metadata: Metadata) => {
    if (!metadata) return;

    dispatch({
      type: 'SET_CART_META',
      payload: metadata,
    });
  };

  const updateCartMetadata = (metadata: Metadata) => {
    if (!metadata) return;

    dispatch({
      type: 'UPDATE_CART_META',
      payload: metadata,
    });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        getItem,
        inCart,
        setItems,
        addItem,
        updateItem,
        updateItemQuantity,
        removeItem,
        emptyCart,
        clearCartMetadata,
        setCartMetadata,
        updateCartMetadata,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
