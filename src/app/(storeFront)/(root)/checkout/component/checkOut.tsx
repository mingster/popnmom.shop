'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { useCart } from '@/hooks/use-cart';

import Container from '@/components/ui/container';
import StoreNoItemPrompt from '@/components/store-no-item-prompt';
import Currency from '@/components/currency';
import CartItemInfo from '@/components/cart-item-info';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CartItem } from '@/types/types';
import { Address, PaymentMethod, ShippingMethod } from 'prisma/prisma-client';
import {
  User,
  StoreOrder,
  Store,
  StoreShipMethodMapping,
  StorePaymentMethodMapping,
} from '@/types/types';
import { useI18n } from '@/providers/i18n-provider';
import { useTranslation } from '@/app/i18n/client';

export const Checkout = ({ store, user }: props) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const cart = useCart();

  const [inCheckoutSteps, setInCheckoutSteps] = useState(false);

  if (!mounted) return <></>;
  else {
    return (
      <Container>
        <>
          {cart.items.length === 0 && !inCheckoutSteps ? (
            <StoreNoItemPrompt />
          ) : (
            <CheckoutSteps store={store} user={user} onChange={setInCheckoutSteps} />
          )}
        </>
      </Container>
    );
  }
};

type props = {
  store: Store;
  user: User | null;
  onChange?: (newValue: boolean) => void;
};

const CheckoutSteps = ({ store, user, onChange }: props) => {
  const router = useRouter();
  const cart = useCart();
  const { lng } = useI18n();
  const { t } = useTranslation(lng);

  const [totalPrice, setTotalPrice] = useState(cart.cartTotal);
  //const [orderNote, setOrderNote] = useState('');
  //const [orderId, setOrderId] = useState('');
  const [states, setStates] = useState({
    orderId: '',
    orderNote: '',
  });

  const allShipMethods = store.storeShippingMethods as StoreShipMethodMapping[];
  const [shipMethod, setShipMethod] = useState<ShippingMethod>(allShipMethods[0].shippingMethod);

  const allpaymentMethods = store.storePaymentMethods as StorePaymentMethodMapping[];
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    allpaymentMethods[0].paymentMethod,
  );
  //const [selectedPaymentType, setSelectedPaymentType] = useState('creditCard');

  useEffect(() => {
    if (shipMethod) {
      setTotalPrice(Number(cart.cartTotal) + Number(shipMethod.basic_price));
    }
  }, [cart.cartTotal, shipMethod]);

  //console.log('selected shipMethod: ' + shipMethod);
  //console.log('CheckutSteps: ' + JSON.stringify(shipMethods));

  if (!user) return <AskUserToSignIn />;

  //console.log('user: ' + JSON.stringify(user.addresses));

  let productIds: string[] = [];
  let prices: number[] = [];
  let quantities: number[] = [];
  let notes: string[] = [];
  cart.items.map((item) => {
    productIds.push(item.id);
    prices.push(item.price);
    quantities.push(Number(item.quantity));
    notes.push(item.userData);
  });

  const handleTabChange = (paymentMethodId: string) => {
    //setSelectedPaymentType(paymentMethodId);
    const selected = allpaymentMethods.find(
      (o: StorePaymentMethodMapping) => o.paymentMethod.id === paymentMethodId,
    );
    if (selected) setPaymentMethod(selected.paymentMethod);
    //console.log('selected payment type: ' + selected?.paymentMethod.name);
  };

  const handleOrderDataChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setStates({
      ...states,
      [e.target.name]: e.target.value.trim(),
    });
  };

  //create an order, and then process to the selected payment method
  //
  const placeOrder = async () => {
    if (!paymentMethod) {
      const errmsg = t('checkout_no_paymentMethod');
      console.error(errmsg);
      return;
    }
    if (!shipMethod) {
      const errmsg = t('checkout_no_shippingMethod');
      console.error(errmsg);
      return;
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_STORE_ID}/storeOrder`;

    if (states.orderNote) {
      notes.push(states.orderNote);
    }

    const body = JSON.stringify({
      userId: user.id,
      orderTotal: totalPrice,
      productIds: productIds,
      prices: prices,
      quantities: quantities,
      notes: notes,
      shippingMethodId: shipMethod.id,
      shippingAddress: displayUserAddress(user),
      shippingCost: shipMethod.basic_price,
      paymentMethodId: paymentMethod.id,
      currency: store.defaultCurrency,
      //checkoutAttributes: orderID,
    });

    //console.log(JSON.stringify(body));

    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    })
      .then((response) => response.json())
      .then((data) => {
        //console.log('featch result: ' + JSON.stringify(data));
        //if pending order, move on to payment
        const order = data.order as StoreOrder;
        //console.log('featch result: ' + JSON.stringify(order));
        //console.log('order.id: ' + order.id);

        // ANCHOR clear cart of the order placed
        //
        if (order) {
          //clear cart
          //cart.emptyCart();
          productIds.map((productId) => {
            cart.removeItem(productId);
          });
        }

        //return value to parent component
        onChange?.(true);

        const url = `../payment/${order.id}/${paymentMethod.payUrl}`;
        //console.log('payment url: ' + url);
        router.push(url);
      })
      .catch((error) => {
        console.error(error);
        toast.error(t('checkout_placeOrder_exception'));
      });
  };

  if (user)
    return (
      <>
        {/* #region 訂單商品 */}
        <div className="text-lg font-medium">{t('checkout')}</div>
        <Card>
          <CardHeader>
            <CardTitle>{t('checkout_orderitems')}</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            {/* render cart items */}
            {cart.items.length != 0 &&
              cart.items.map((item, index) => (
                <CartItemInfo
                  key={index}
                  item={item as CartItem}
                  showProductImg={true}
                  showQuantity={false}
                  showVarity={true}
                  showSubtotal={true}
                />
              ))}
          </CardContent>
          <CardFooter>
            <div className="relative w-full">
              <div className="flex justify-between">
                <div className="flex-none w-1/3 pr-5">
                  <div className="text-xs">{t('checkout_denote')}</div>
                  <Input
                    type="text"
                    name="orderNote"
                    value={states.orderNote}
                    onChange={handleOrderDataChange}
                  />
                </div>
                <div className="flex-auto w-1/3 pr-5">
                  <div className="text-xs">{t('checkout_shipping_label')}</div>
                  <div className="flex">
                    <div className="pr-5 flex">{shipMethod && shipMethod.name}</div>

                    <div className="sm:block hidden">
                      {Number(shipMethod.basic_price) > 0 && displayUserAddress(user)}
                    </div>

                    <DialogShipping
                      allMappings={allShipMethods}
                      user={user}
                      onChange={setShipMethod}
                    />
                  </div>
                </div>
                <div className="justify-end place-self-end flex">
                  <div className="text-xs">{t('checkout_shipping_cost')}</div>
                  {shipMethod && <Currency value={Number(shipMethod.basic_price)} />}
                </div>
              </div>

              <div className="flex justify-end place-self-end mt-2">
                <div className="text-xs">{t('checkout_orderTotal')}</div>
                <Currency value={totalPrice} />
              </div>
            </div>
          </CardFooter>
        </Card>
        {/* #endregion */}
        <div className="pt-5"></div>
        {/* #region 付款方式 */}
        <Card>
          <CardHeader>
            <CardTitle>{t('checkout_paymentMethod')}</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={paymentMethod.id} className="" onValueChange={handleTabChange}>
              <TabsList>
                {allpaymentMethods.map((mapping, index) => (
                  <TabsTrigger key={index} value={mapping.paymentMethod.id}>
                    {mapping.paymentDisplayName}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value="paypal"></TabsContent>
              <TabsContent value="creditCard"></TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <div className="relative w-full">
              <div className="flex justify-between">
                <div className="flex-none w-1/2 pr-1">
                  <div className="text-xs">{t('checkout_note')}</div>
                </div>
                <div className="flex w-1/2 justify-end place-self-end">
                  <Button type="button" onClick={() => placeOrder()}>
                    {t('checkout_orderButton')}
                  </Button>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
        {/* #endregion */}
      </>
    );
};

function displayUserAddress(user: User) {
  if (user && user.addresses) {
    let the_address = user.addresses.find((obj: Address) => obj.isDefault === true);
    if (!the_address) the_address = user.addresses[0];
    //console.log('the_address: ' + JSON.stringify(the_address));

    if (!the_address) return '';

    return (
      the_address.postalCode +
      ' ' +
      the_address.city +
      the_address.district +
      the_address.streetLine1
    );
  }
}

const AskUserToSignIn = () => {
  const session = useSession();
  const { lng } = useI18n();
  const { t } = useTranslation(lng);

  let email = session.data?.user?.email as string;
  if (!email) email = '';

  return (
    <>
      {email === '' && (
        <div className="my-5">
          <Link
            title={t('checkout_signIn')}
            key="signin"
            href="#"
            onClick={() => signIn()}
            className="hover:font-bold text-primary"
          >
            {t('checkout_signIn')}
          </Link>
          {t('checkout_or')}
          <Link
            title={t('checkout_signUp')}
            key="signup"
            href="#"
            onClick={() => signIn()}
            className="hover:font-bold text-primary"
          >
            {t('checkout_signUp')}
          </Link>
          {t('checkout_signInNote')}
        </div>
      )}
    </>
  );
};

type shippingDialogProps = {
  allMappings: StoreShipMethodMapping[];
  user: User | null;
  onChange?: (newMethod: ShippingMethod) => void;
};

// display store supported shipping methods, and bind with user's default shipping perference
const DialogShipping = ({ allMappings, user, onChange }: shippingDialogProps) => {
  const { lng } = useI18n();
  const { t } = useTranslation(lng);
  const [open, setOpen] = useState(false);
  //console.log(JSON.stringify(user));
  const [selectedMethod, setSelectedMethod] = useState<ShippingMethod>();
  function selectShipMethod(method: StoreShipMethodMapping) {
    setSelectedMethod(method.shippingMethod);
    save();
  }
  function save() {
    if (selectedMethod) {
      onChange?.(selectedMethod);
      console.log('selected: ' + selectedMethod.name);
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{t('checkout_shippingButton')}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('checkout_shippingTitle')}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            {allMappings.map((method, index) => (
              <div
                className="cursor-pointer border px-5 py-5"
                key={index}
                onClick={() => selectShipMethod(method)}
              >
                {method.shippingMethod.name}
                <Currency value={Number(method.shippingMethod.basic_price)} />
              </div>
            ))}
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          {/*
          <DialogClose asChild>
            <Button type="button" variant="link">
              取消
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="default"
            onClick={() =>
              //return value to parent component
              save()
            }
          >
            完成
          </Button>

*/}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
