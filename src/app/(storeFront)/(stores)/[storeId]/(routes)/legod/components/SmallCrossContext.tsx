'use client';

import React, { useRef, useState, useContext, createContext } from 'react';
import { proxy } from 'valtio';
import { DefaultSmallCrossPreset, iSmallCrossContext, CrossPreset } from '../constants';
import { useCart } from '@/hooks/use-cart';

type SmallCrossContextProviderProps = {
  children: React.ReactNode;
};

export const SmallCrossContext = createContext({});

export const SmallCrossContextProvider = ({ children }: SmallCrossContextProviderProps) => {
  let obj = proxy({ current: null });

  const cart = useCart();
  const existingItem = cart.items.find(
    (item) => item.id === process.env.NEXT_PUBLIC_SMCROSS_PRODUCT_ID,
  );

  //console.log('existingItem (smCross): ' + existingItem);

  if (existingItem) {
    let json = existingItem.userData as string;
    let preset = JSON.parse(json) as CrossPreset;

    obj = proxy({
      current: null, //this hold a string value of the current selected item
      items: {
        Lego11: preset.parts[0].color.color,
        Lego12: preset.parts[1].color.color,
        Lego13: preset.parts[2].color.color,

        Lego21: preset.parts[3].color.color,
        Lego22: preset.parts[4].color.color,
        Lego23: preset.parts[5].color.color,

        Lego31: preset.parts[6].color.color,
        Lego32: preset.parts[7].color.color,
        Lego33: preset.parts[8].color.color,

        Chain: preset.parts[9].color.color,
        words: preset.words,
      } as iSmallCrossContext,
    });
  } else {
    // Using a Valtio state model to bridge reactivity between
    // the canvas and the dom, both can write to it and/or react to it.
    obj = proxy({
      current: null, //this hold a string value of the current selected item
      items: {
        Lego11: DefaultSmallCrossPreset.parts[0].color.color,
        Lego12: DefaultSmallCrossPreset.parts[1].color.color,
        Lego13: DefaultSmallCrossPreset.parts[2].color.color,

        Lego21: DefaultSmallCrossPreset.parts[3].color.color,
        Lego22: DefaultSmallCrossPreset.parts[4].color.color,
        Lego23: DefaultSmallCrossPreset.parts[5].color.color,

        Lego31: DefaultSmallCrossPreset.parts[6].color.color,
        Lego32: DefaultSmallCrossPreset.parts[7].color.color,
        Lego33: DefaultSmallCrossPreset.parts[8].color.color,

        Chain: DefaultSmallCrossPreset.parts[9].color.color,
        words: DefaultSmallCrossPreset.words,
      } as iSmallCrossContext,
    });
  }

  const state = useRef(obj).current;
  //const [customization, setCustomization] = useState(state);

  return (
    <SmallCrossContext.Provider
      value={{
        state,
      }}
    >
      {children}
    </SmallCrossContext.Provider>
  );
};

export const useSmCrossCustomization = () => {
  const context = useContext(SmallCrossContext);
  return context;
};
