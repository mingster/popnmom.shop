import Container from '@/components/ui/container';

import { useI18n } from '@/providers/i18n-provider';
import { useTranslation } from '@/app/i18n/client';

export default function CheckoutSuccessPage() {
  const { lng } = useI18n();
  const { t } = useTranslation(lng);

  //when we get here, the checkout cart item should be removed
  //
  /* this code causes client side error
'use client';
  import useCart from '@/hooks/use-cart';
  try {
    const cart = useCart();
    cart.removeAll();
  } catch (e) {
    console.error(e);
  }
  */
  return (
    <Container>
      <h1>{t('checkoutSuccess_title')}</h1>
      {t('checkoutSuccess_desc')}
    </Container>
  );
}
