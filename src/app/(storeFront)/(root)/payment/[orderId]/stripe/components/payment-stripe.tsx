'use client';

import { LinkAuthenticationElement, PaymentElement, Elements } from '@stripe/react-stripe-js';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import React from 'react';

import getStripe from '@/lib/get-stripejs';
import StripeForm from './stripe-form';
import { StoreOrder } from 'prisma/prisma-client';

import { useI18n } from '@/providers/i18n-provider';
import { useTranslation } from '@/app/i18n/client';

type paymentProps = {
  order: StoreOrder;
};
export type StripeTypes = {
  clientSecret: string;
  appearance: {
    theme: 'stripe';
    variables: {
      colorPrimary: string;
    };
  };
};

// ANCHOR create a stripe payment intent and then use it to display stripe payment element.
// Following the element, a payment button is displayed (<StripeForm/>).
//
const PaymentStripe: React.FC<paymentProps> = ({ order }) => {
  const { lng } = useI18n();
  const { t } = useTranslation(lng, 'payment-stripe');

  const stripePromise = getStripe();
  const [clientSecret, setClientSecret] = useState('');

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  //call payment intent api to get client secret
  useEffect(() => {
    if (!order) return;

    const chargeTotal = Number(order.orderTotal);
    const currency = order.currency;

    if (chargeTotal <= 0) return;

    const body = JSON.stringify({
      currency: currency,
    });

    const url = `/api/payment/stripe/create_payment_intent/${chargeTotal}`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    })
      .then((res) => res.json())
      .then(({ client_secret }) => setClientSecret(client_secret));
  }, [order]);

  //console.log('clientSecret: ' + clientSecret);

  const options: StripeTypes = {
    // pass the client secret
    clientSecret: clientSecret,
    // Fully customizable with appearance API.
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#008b8b',
      },
    },
  };

  const session = useSession();
  let email = session.data?.user?.email as string;
  if (!email) email = '';

  let name = session.data?.user?.name as string;
  if (!name) name = '';

  //const [message, setMessage] = useState('');
  //const [isLoading, setIsLoading] = useState(false);

  if (!mounted) {
    return <></>;
  }

  return (
    clientSecret !== '' &&
    stripePromise !== null && (
      <Elements stripe={stripePromise} options={options}>
        <LinkAuthenticationElement
          id="link-authentication-element"
          // Access the email value like so:
          // onChange={(event) => {
          //  setEmail(event.value.email);
          // }}
          //
          // Prefill the email field like so:
          options={{ defaultValues: { email: email } }}
        />
        <PaymentElement
          id="payment-element"
          options={{
            defaultValues: {
              billingDetails: {
                email: email,
                name: name,
                /*
                phone: '888-888-8888',
                address: {
                  postal_code: '10001',
                  country: 'US',
                }, */
              },
            },
          }}
        />
        {t('payment_stripe_payAmount')}
        {Number(order.orderTotal)} {order.currency}
        <StripeForm order={order} />
      </Elements>
    )
  );
};

export default PaymentStripe;
