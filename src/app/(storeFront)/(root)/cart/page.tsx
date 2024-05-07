'use client';

import { useEffect, useState } from 'react';

import Container from '@/components/ui/container';
import { useCart } from '@/hooks/use-cart';

import CartSummary from '@/components/cart-summary';
import CartItemInfo from '@/components/cart-item-info';
import { CartItem } from '@/types/types';
import { useI18n } from '@/providers/i18n-provider';
import { useTranslation } from '@/app/i18n/client';

//export const revalidate = 0;

const CartPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const cart = useCart();
  const { lng } = useI18n();
  const { t } = useTranslation(lng);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Container>
        <div className="px-0 py-16 sm:px-2 lg:px-2">
          <h1 className="text-3xl font-bold">{t('cart')}</h1>

          {cart.items.length === 0 && <p className="text-primary">{t('cart_noitem')}</p>}

          {cart.items.map((item) => (
            <CartItemInfo
              key={item.id}
              item={item as CartItem}
              showProductImg={true}
              showVarity={true}
              showQuantity={true}
              showSubtotal={false}
            />
          ))}
        </div>
        <div className="relative">
          <div className="fixed bottom-0 left-0 w-full h-100 content-center justify-center">
            <CartSummary />
          </div>
        </div>
      </Container>
    </>
  );
};

export default CartPage;
