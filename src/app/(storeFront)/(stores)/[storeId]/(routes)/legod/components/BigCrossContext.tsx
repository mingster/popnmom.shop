'use client';

import React, { useRef, useState, useContext, createContext } from 'react';
import { proxy } from 'valtio';
import { DefaultBigCrossPreset, iBigCrossContext, CrossPreset } from '../constants';
import { useCart } from '@/hooks/use-cart';

type BigCrossContextProviderProps = {
  children: React.ReactNode;
};

export const BigCrossContext = createContext({});

export const BigCrossContextProvider = ({ children }: BigCrossContextProviderProps) => {
  let obj = proxy({ current: null });

  const cart = useCart();
  const existingItem = cart.items.find(
    //(item) => item.name === '客製大十字',
    (item) => item.id === process.env.NEXT_PUBLIC_BIGCROSS_PRODUCT_ID,
  );

  //console.log('existingItem: ' + existingItem)

  if (existingItem) {
    let json = existingItem.userData as string;
    let preset = JSON.parse(json) as CrossPreset;

    obj = proxy({
      current: null, //this hold a string value of the current selected item
      items: {
        Lego11: preset.parts[0].color.color,
        Lego12: preset.parts[1].color.color,
        Lego13: preset.parts[2].color.color,
        Lego14: preset.parts[3].color.color,
        Lego21: preset.parts[4].color.color,
        Lego22: preset.parts[5].color.color,
        Lego23: preset.parts[6].color.color,
        Lego24: preset.parts[7].color.color,
        Lego25: preset.parts[8].color.color,
        Lego31: preset.parts[9].color.color,
        Lego32: preset.parts[10].color.color,
        Lego33: preset.parts[11].color.color,
        Lego34: preset.parts[12].color.color,
        Chain: preset.parts[13].color.color,
        words: preset.words,
      } as iBigCrossContext,
    });
  } else {
    // Using a Valtio state model to bridge reactivity between
    // the canvas and the dom, both can write to it and/or react to it.
    obj = proxy({
      current: null, //this hold a string value of the current selected item
      items: {
        Lego11: DefaultBigCrossPreset.parts[0].color.color,
        Lego12: DefaultBigCrossPreset.parts[1].color.color,
        Lego13: DefaultBigCrossPreset.parts[2].color.color,
        Lego14: DefaultBigCrossPreset.parts[3].color.color,
        Lego21: DefaultBigCrossPreset.parts[4].color.color,
        Lego22: DefaultBigCrossPreset.parts[5].color.color,
        Lego23: DefaultBigCrossPreset.parts[6].color.color,
        Lego24: DefaultBigCrossPreset.parts[7].color.color,
        Lego25: DefaultBigCrossPreset.parts[8].color.color,
        Lego31: DefaultBigCrossPreset.parts[9].color.color,
        Lego32: DefaultBigCrossPreset.parts[10].color.color,
        Lego33: DefaultBigCrossPreset.parts[11].color.color,
        Lego34: DefaultBigCrossPreset.parts[12].color.color,
        Chain: DefaultBigCrossPreset.parts[13].color.color,
        words: DefaultBigCrossPreset.words,
      } as iBigCrossContext,
    });
  }

  const state = useRef(obj).current;
  //const [customization, setCustomization] = useState(state);

  return (
    <BigCrossContext.Provider
      value={{
        state,
      }}
    >
      {children}
    </BigCrossContext.Provider>
  );
};

export const useCustomization = () => {
  const context = useContext(BigCrossContext);
  return context;
};
