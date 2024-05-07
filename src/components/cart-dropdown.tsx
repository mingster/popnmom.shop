'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { Badge } from '@mui/material';
import { useCart } from '@/hooks/use-cart';
import StoreNoItemPrompt from '@/components/store-no-item-prompt';
import CartItemInfo from '@/components/cart-item-info';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CartItem } from '@/types/types';
import { useI18n } from '@/providers/i18n-provider';
import { useTranslation } from '@/app/i18n/client';

const CartDropdown = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const cart = useCart();
  const { lng } = useI18n();
  const { t } = useTranslation(lng);

  //const items = useCart((state) => state.items);
  //const isAboveMediumScreens = useMediaQuery('(min-width: 1060px)');

  const router = useRouter();

  function onCheckout() {
    //bring to checkout page and close the cart dropdown
    close();
    router.push('/checkout');
  }

  function onCart() {
    //bring to checkout page and close the cart dropdown
    close();
    router.push('/cart');
  }
  const [numInCart] = useState(cart.totalItems);
  if (!mounted) return <></>;

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer">
            <Badge badgeContent={numInCart} color="primary">
              <ShoppingBag size={20} className="object-contain text-[#e4e4e7] hover:text-slate" />
            </Badge>
          </div>
        </SheetTrigger>
        <SheetContent side="right">
          <div className="overflow-y-scroll w-full px-1 grid grid-cols-1 gap-y-8 no-scrollbar">
            {cart.items.length === 0 ? (
              <StoreNoItemPrompt />
            ) : (
              <>
                <Button
                  onClick={onCheckout}
                  disabled={cart.items.length === 0}
                  className="w-full bg-primary hover:bg-slate hover:text-black"
                >
                  {t('cart_dropDown_placeOrder')}
                </Button>

                {/* render cart items */}
                {cart.items.map((item, index) => (
                  <CartItemInfo
                    key={index}
                    item={item as CartItem}
                    showProductImg={false}
                    showQuantity={true}
                    showVarity={true}
                    showSubtotal={false}
                  />
                ))}
                {/*管理購物車 */}
                <div className="w-full flex items-end justify-end">
                  <Button
                    onClick={onCart}
                    disabled={cart.items.length === 0}
                    className="bg-secondary text-xs hover:bg-slate hover:text-black"
                  >
                    {t('cart_dropDown_gotoCart')}
                  </Button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/*


                <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
                  <div className="lg:col-span-12">
                  </div>
                </div>

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

let menu_width = 'w-[414px]';
  if (isAboveMediumScreens) menu_width = 'lg:w-[1380px]';

      <Popover>
        <PopoverTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer">
            <ShoppingBag size={20} className="object-contain text-[#e4e4e7] hover:text-slate" />
          </div>
        </PopoverTrigger>

        <PopoverContent
          className={`${menu_width} small:block absolute top-[calc(100%+1px)] right-[-5px] border-x border-b border-yellow-900 `}
        >
          <div className="overflow-y-scroll max-h-[402px] h-[402px] w-full px-4 grid grid-cols-1 gap-y-8 no-scrollbar">
            {cart.items.length === 0 ? (
              <StoreNoItemPrompt />
            ) : (
              <>
                <Button
                  onClick={onCheckout}
                  disabled={items.length === 0}
                  className="w-full mt-6 bg-primary hover:bg-slate hover:text-black"
                >
                  結帳
                </Button>

                <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
                  <div className="lg:col-span-12">
                    {cart.items.map((item) => (
                      <CartItem key={item.id} item={item} showQuantity={true} showVarity={true} />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>

            <div className="text-[18px] font-bold cursor-pointer flex  text-[#e4e4e7] hover:text-slate">
              <span className="sm:block hidden">購物車&nbsp;</span>
              <span className="ml-1 text-sm font-medium text-secondary">
                {cart.items.length}
              </span>
            </div>
            <Link
                key='cart'
                href='/cart' className='hover:text-secondary' title='購物車'>
                <div className='flex gap-0 content-center'>
                    <ShoppingBag color="white" className='gap-0 w-{20}' />
                    <span className="ml-1 text-sm font-medium text-secondary">
                        {cart.items.length}
                    </span>
                    購物車
                </div>
            </Link>
        */}
    </>
  );
};

export default CartDropdown;
