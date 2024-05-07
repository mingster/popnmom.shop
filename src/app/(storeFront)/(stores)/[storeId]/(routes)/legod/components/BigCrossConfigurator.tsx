'use client';

import { useSnapshot } from 'valtio';
import PinInput from 'react-pin-input';
//import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

import './Configurator.css';
import { useCustomization } from './BigCrossContext';
import { LEGO_COLORS, CHAIN_COLORS, CrossPreset, LEGO_Color, LegoPart } from '../constants';
import { Button } from '@/components/ui/button';
import { globalStyle } from '@/global-style';
import { useCart } from '@/hooks/use-cart';
import { CartItem, CartProductStatus } from '@/types/types';
import { useI18n } from '@/providers/i18n-provider';
import { useTranslation } from '@/app/i18n/client';
import { useEffect, useState } from 'react';

interface InfoProps {
  product: CartItem;
}

const BigCrossConfigurator: React.FC<InfoProps> = ({ product }) => {
  let router = useRouter();
  const cart = useCart();
  //cart.getItem(product.id);
  const { lng } = useI18n();
  const { t } = useTranslation(lng, 'legod');

  //this is array of lego colors and the pin from BigCrossContext
  const { state } = useCustomization() as any;
  const snap = useSnapshot(state);

  //currentSelected hold the part name as user click the part
  let currentSelected = snap.current as string;

  //console.log(JSON.stringify(snap));
  //console.log('currentSelected: ' + currentSelected);

  if (snap.current === null) {
    currentSelected = '';
  }
  //this is default value to display in pin input
  let pin = snap.items['words'];

  //return LEGO_COLOR object by color
  function getLegoColor(color: string): LEGO_Color {
    let result = LEGO_COLORS.find((item) => item.color === color);
    if (result != undefined || result != null) {
      return result;
    } else {
      return LEGO_COLORS[0];
    }
  }

  function saveCustomization() {
    //map state value back to LegoPart objects and then save it...
    let newCustomProduct: CrossPreset = {
      name: 'big cross',
      words: state.items['words'],
      parts: [],
    };

    // #region save customerization
    let customColorLego11 = {
      name: 'Lego11',
      color: getLegoColor(state.items['Lego11']),
    } as LegoPart;
    let customColorLego12 = {
      name: 'Lego12',
      color: getLegoColor(state.items['Lego12']),
    } as LegoPart;
    let customColorLego13 = {
      name: 'Lego13',
      color: getLegoColor(state.items['Lego13']),
    } as LegoPart;
    let customColorLego14 = {
      name: 'Lego14',
      color: getLegoColor(state.items['Lego14']),
    } as LegoPart;
    let customColorLego21 = {
      name: 'Lego21',
      color: getLegoColor(state.items['Lego21']),
    } as LegoPart;
    let customColorLego22 = {
      name: 'Lego22',
      color: getLegoColor(state.items['Lego22']),
    } as LegoPart;
    let customColorLego23 = {
      name: 'Lego23',
      color: getLegoColor(state.items['Lego23']),
    } as LegoPart;
    let customColorLego24 = {
      name: 'Lego24',
      color: getLegoColor(state.items['Lego24']),
    } as LegoPart;
    let customColorLego25 = {
      name: 'Lego25',
      color: getLegoColor(state.items['Lego25']),
    } as LegoPart;
    let customColorLego31 = {
      name: 'Lego31',
      color: getLegoColor(state.items['Lego31']),
    } as LegoPart;
    let customColorLego32 = {
      name: 'Lego32',
      color: getLegoColor(state.items['Lego32']),
    } as LegoPart;
    let customColorLego33 = {
      name: 'Lego33',
      color: getLegoColor(state.items['Lego33']),
    } as LegoPart;
    let customColorLego34 = {
      name: 'Lego34',
      color: getLegoColor(state.items['Lego34']),
    } as LegoPart;
    let customColorChain = { name: 'Chain', color: getLegoColor(state.items['Chain']) } as LegoPart;
    newCustomProduct.parts.push(customColorLego11);
    newCustomProduct.parts.push(customColorLego12);
    newCustomProduct.parts.push(customColorLego13);
    newCustomProduct.parts.push(customColorLego14);
    newCustomProduct.parts.push(customColorLego21);
    newCustomProduct.parts.push(customColorLego22);
    newCustomProduct.parts.push(customColorLego23);
    newCustomProduct.parts.push(customColorLego24);
    newCustomProduct.parts.push(customColorLego25);
    newCustomProduct.parts.push(customColorLego31);
    newCustomProduct.parts.push(customColorLego32);
    newCustomProduct.parts.push(customColorLego33);
    newCustomProduct.parts.push(customColorLego34);
    newCustomProduct.parts.push(customColorChain);
    // #endregion

    const json = JSON.stringify(newCustomProduct);
    //console.log(json);

    //add to cart
    product.userData = json;
    return product;
  }

  //save the cross for editing
  //
  function handleNextStep() {
    const product = saveCustomization();
    product.cartStatus = CartProductStatus.ReadyToCheckout;

    if (cart.getItem(product.id)) {
      // update without adding quantity
      cart.updateItem(product.id, product as CartItem);
    } else {
      cart.addItem(product as CartItem, 1);
    }

    router.push('/cart');
  }

  //save the cross for editing
  //
  function handleSaveClick() {
    const product = saveCustomization();
    product.cartStatus = CartProductStatus.InProgress;

    //console.log(JSON.stringify(product)); //the product data contain the whole 9 yard

    if (cart.getItem(product.id)) {
      // update without adding quantity
      cart.updateItem(product.id, product as CartItem);
      toast.success(t('config_handleSaveClick_saved'));
    } else {
      cart.addItem(product as CartItem, 1);
      toast.success(t('config_handleSaveClick_created'));
    }
    router.push('/cart');
  }

  function changePartColor(newColor: string) {
    state.items[currentSelected] = newColor;
    //console.log('changePartColor for: ' + currentSelected + ' new color: ' + newColor);
  }
  function changeWords(newWord: string) {
    state.items['words'] = newWord;
    //console.log('changeWords for: ' + currentSelected + ' new word: ' + newWord);
  }

  const [currentChainColor, setCurrentChainColor] = useState(state.items['Chain']);
  function changeChainColor(newColor: string) {
    state.items['Chain'] = newColor;
    setCurrentChainColor(newColor);
    //console.log('changeChainColor: ' + ' new color: ' + newColor);
  }
  //console.log('current chain color: ' + state.items['Chain']);

  useEffect(() => {
    setCurrentChainColor(state.items['Chain']);
  }, [state.items]);

  return (
    <>
      <div className="configurator" style={{ display: currentSelected ? 'block' : 'none' }}>
        <div className="configurator__section">
          <div className={`${globalStyle.heroSubText} mt-2 uppercase`}>{currentSelected}</div>
          <div className="configurator__section__values">
            {currentSelected.includes('Lego') && (
              <>
                <div className="text-zinc-400 text-xs md:text-sm font-normal w-full">
                  {t('config_changePart_prompt')}
                </div>
                {LEGO_COLORS.map((item, index) => (
                  <div
                    key={index}
                    className={`item ${
                      item.color === LEGO_COLORS[index].color ? 'item--active' : ''
                    }`}
                    onClick={
                      () => changePartColor(item.color)
                      //console.log(snap.current)
                    }
                  >
                    <div
                      className="item__dot sm:item__dot_sm"
                      style={{ backgroundColor: item.color }}
                    />
                    {/*<div className="item__label">{item.name}</div>*/}
                  </div>
                ))}
              </>
            )}
            {currentSelected.includes('Chain') && <></>}
            {currentSelected.includes('word') && (
              <>
                <div className="text-zinc-400 text-xs md:text-sm font-normal w-full">
                  {t('config_changeWord_prompt')}
                </div>
                <div className="text-white uppercase">
                  <PinInput
                    length={5}
                    initialValue={pin}
                    type="custom"
                    inputMode="string"
                    //ref={(p) => (pin = p)}
                    style={{ padding: '10px' }}
                    inputStyle={{ borderColor: '#f5f5f4', color: '#fff', backgroundColor: '#333' }}
                    inputFocusStyle={{ borderColor: '#eab308' }}
                    autoSelect={true}
                    //onChange={v => {console.log('v: ' + v);}}
                    onComplete={(v) => {
                      changeWords(v);
                    }}
                    regexCriteria={/^[A-Za-z ]+$/}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="fixed bottom-1 w-full">
          <div className="flex flex-row gap-1">
            <div className="basis-1/2 flex justify-start pl-2">
              <div className="text-zinc-400 text-xs md:text-sm font-normal place-self-center">
                {t('config_changeChain_prompt')}
              </div>
              <div className="flex place-self-center">
                {CHAIN_COLORS.map((item, index) => (
                  <div
                    key={index}
                    className={`item ${
                      item.color === currentChainColor
                        ? 'rounded-full border-2 border-solid  border-yellow-500/100'
                        : ''
                    }`}
                    onClick={() => changeChainColor(item.color)}
                  >
                    <div
                      className="item__dot sm:item__dot_sm"
                      style={{ backgroundColor: item.color }}
                    />
                    {/*<div className="item__label">{item.name}</div>*/}
                  </div>
                ))}
              </div>
            </div>
            <div className="basis-1/4 flex gap-1 pr-2">
              <Button
                onClick={handleSaveClick}
                className="md:text-sm p-4 md:p-3 bg-gradient-to-r from-gray-600 to-black-100 hover:from-pink-500 hover:to-yellow-500"
              >
                {t('config_handleSaveClick_btn')}
              </Button>

              <Button
                onClick={handleNextStep}
                className="md:text-sm p-4 md:p-3 font-semibold bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500"
              >
                {t('config_handleNextStep_btn')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default BigCrossConfigurator;
