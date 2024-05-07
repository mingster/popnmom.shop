'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Stripe from 'stripe';
import { useRouter } from 'next/router';

import HtmlButton from '@/components/ui/html-button';
import { StoreOrder } from 'prisma/prisma-client';
import { getAbsoluteUrl } from '@/lib/utils';

import { useI18n } from '@/providers/i18n-provider';
import { useTranslation } from '@/app/i18n/client';

const defaultFormFields = {
  displayName: '',
  email: '',
};
type PaymentStripeProp = {
  order: StoreOrder;
};

// ANCHOR As user clicks the pay button, we call stripe.confirmPayment to verify the payment status.
// If no error, display confirmation page to the customer.
//
const StripeForm: React.FC<PaymentStripeProp> = ({ order }) => {
  //const router = useRouter();
  const { lng } = useI18n();
  const { t } = useTranslation(lng, 'payment-stripe');

  const [mounted, setMounted] = useState(false);

  const elements = useElements();
  const stripe = useStripe();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { displayName, email } = formFields;

  const origin = getAbsoluteUrl();
  //typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';

  /*
  const paymentHandler = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget
    const formElements = form.elements as typeof form.elements & {
      usernameInput: {value: string}
    }
  };
*/
  const paymentHandler = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    //const paymentHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    setIsProcessingPayment(true);

    const returnUrl = origin + `/payment/${order.id}/stripe/confirm`;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // redirect to route thankyou
        //return_url: 'http://localhost:3001/checkout/success',
        return_url: returnUrl,
      },
    });

    setIsProcessingPayment(false);

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
      console.log('payment confirmed');
      //router.push(returnUrl);
    }
  };
  /*
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };
*/

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <></>;
  }

  return (
    <form onSubmit={paymentHandler}>
      {errorMessage && (
        <div
          className="text-pink-500 p-2
              rounded-md mt-2 bold bg-pink-100"
        >
          {errorMessage}
        </div>
      )}
      {/* isLoading will disable the button on its first click. */}
      <HtmlButton
        disabled={isProcessingPayment}
        type="submit"
        className="w-full font-semibold bg-gradient-to-r from-purple-400 to-pink-600 hover:from-green-400 hover:to-blue-500"
      >
        {t('payment_stripeForm_payButton')}
      </HtmlButton>
    </form>
  );
};

export default StripeForm;
