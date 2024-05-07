'use client';
import { useEffect, useState } from 'react';

import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import { PayPalScriptOptions } from '@paypal/paypal-js/types/script-options';
import { toast } from 'react-hot-toast';
import { redirect } from 'next/navigation';

import { StoreOrder } from 'prisma/prisma-client';
import { getAbsoluteUrl } from '@/lib/utils';
import { Loader } from '@/components/ui/loader';

import { useI18n } from '@/providers/i18n-provider';
import { useTranslation } from '@/app/i18n/client';

type paymentProps = {
  order: StoreOrder;
};

// ANCHOR PaymentPayPal allows customer to paid with PayPal by clicking the PayPal button shown.
//
// LINK - https://github.com/paypaldev/PayPal-React-FullStack-Standard-Checkout-Sample/blob/main/client/App.jsx
const PaymentPayPal: React.FC<paymentProps> = ({ order }) => {
  if (!order) {
    console.error('no order');
    throw new Error('no order');
  }

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <></>;
  }

  const chargeTotal = Number(order.orderTotal);
  if (chargeTotal <= 0) return;

  const currency = order.currency;
  const origin = getAbsoluteUrl();

  const redirectUrl = origin + `/payment/${order.id}/paypal/confirm`;

  const paypalScriptOptions: PayPalScriptOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    currency: currency,
    intent: 'capture',
  };

  /*
  async function testCreateOrder() {
    const url =
      process.env.NEXT_PUBLIC_API_URL +
      '/pay/capture-order/?storeId=' +
      process.env.NEXT_PUBLIC_STORE_ID;

    const response = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'no-cors',
      body: JSON.stringify({
        checkoutAttributes: '5E373649G2887644X',
      }),
    });
    console.log(JSON.stringify(response));
  }
  <form onSubmit={testCreateOrder}><button>submit</button></form>
 */
  return (
    <>
      <PayPalScriptProvider options={paypalScriptOptions}>
        <PayPalButton orderId={order.id} currency={currency} redirectUrl={redirectUrl} />
      </PayPalScriptProvider>
    </>
  );
};

export default PaymentPayPal;

type payPalButtonProps = {
  currency: string;
  orderId: string;
  redirectUrl: string;
};

const PayPalButton: React.FC<payPalButtonProps> = ({ currency, orderId, redirectUrl }) => {
  const [{ isPending }] = usePayPalScriptReducer();
  const [status, setStatus] = useState('unpaid');

  const { lng } = useI18n();
  const { t } = useTranslation(lng, 'payment-paypal');

  if (status === 'paid') {
    redirect(redirectUrl);
  }

  return (
    <>
      {isPending ? <Loader /> : null}
      <PayPalButtons
        createOrder={async () => {
          try {
            // ANCHOR - create paypal payment intent and an pending order in our database
            //
            const body = {
              currency: currency,
              orderId: orderId,
              redirectUrl: redirectUrl,
            };

            const response = await fetch('/api/payment/paypal/create-payment-intent/', {
              method: 'POST',
              //mode: 'no-cors',
              headers: {
                'Content-Type': 'application/json',
              },
              // use the "body" param to optionally pass additional order information
              // like product ids and quantities
              body: JSON.stringify(body),
            });

            const orderData = await response.json();
            //console.log('paypal button: ' + orderData.orderID);

            if (orderData.paymentIntentId) {
              return orderData.paymentIntentId;
            } else {
              const errorDetail = orderData?.details?.[0];
              const errorMessage = errorDetail
                ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                : JSON.stringify(orderData);

              console.error(errorMessage);
              throw new Error(errorMessage);
            }
          } catch (error) {
            console.error(error);
            //setMessage(`Could not initiate PayPal Checkout...${error}`);
          }
        }}
        onApprove={async (data, actions) => {
          const body = {
            orderID: data.orderID,
          };

          try {
            const response = await fetch(`/api/payment/paypal/capture-order/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(body),
            });

            const captureData = await response.json();
            //console.log(JSON.stringify(captureData));
            // ANCHOR
            // Three cases to handle:
            //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
            //   (2) Other non-recoverable errors -> Show a failure message
            //   (3) Successful transaction -> Show confirmation or thank you message

            const status = captureData?.captureData.result.status;
            //console.log('status: ' + JSON.stringify(status));

            if (status === 'COMPLETED') {
              toast.success(t('success_title'));
              setStatus('paid');
            } else {
              const errorDetail = captureData?.captureData.details?.[0];

              if (errorDetail?.issue === 'INSTRUMENT_DECLINED') {
                // ANCHOR
                // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
                return actions.restart();
              } else if (errorDetail) {
                // ANCHOR
                // (2) Other non-recoverable errors -> Show a failure message
                throw new Error(`${errorDetail.description} (${captureData.debug_id})`);
              }

              toast.error(t('failure_title'));
            }
          } catch (error) {
            toast.error(t('failure_title'));
            console.error(error);
            //setMessage( `Sorry, your transaction could not be processed...${error}`,     );
          }
        }}
      />
    </>
  );
};
