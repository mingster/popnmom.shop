'use server';
import Stripe from 'stripe';
import { SuccessAndRedirect } from '../components/success-and-redirect';

// this page is hit when stripe element confirmed the payment.
// here we mark the order as paid, show customer a message and redirect to account page.
export default async function Page({
  params,
  searchParams,
}: {
  params: { orderId: string };
  searchParams: { payment_intent: string; payment_intent_client_secret: string };
}) {
  if (!params.orderId) {
    throw new Error('order Id is missing');
  }

  //http://localhost:3001/payment/52af45f3-12bc-4c6d-967a-b51c980c7b48/stripe/confirm?
  //payment_intent=pi_2OMs29qw2UGRduYS1g2umg13&
  //payment_intent_client_secret=pi_2OMs29qw2UGRduYS1g2umg13_secret_bxm9PFV4eQP7vhHVam5Gf5Y0K
  //&redirect_status=succeeded

  //console.log('orderId: ' + params.orderId);
  //console.log('payment_intent: ' + searchParams.payment_intent);
  //console.log('client_secret: ' + searchParams.payment_intent_client_secret);

  //const payment_intent = searchParams.get('payment_intent');
  //const client_secret = searchParams.get('payment_intent_client_secret');
  if (searchParams.payment_intent && searchParams.payment_intent_client_secret) {
    const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    const pi = await stripe.paymentIntents.retrieve(searchParams.payment_intent, {
      client_secret: searchParams.payment_intent_client_secret,
    });

    if (pi) {
      //console.log(JSON.stringify(pi));
      const url = `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_STORE_ID}/storeOrder/${params.orderId}/markAsPaid`;
      //console.log(url);

      const checkoutAttributes = JSON.stringify({
        payment_intent: searchParams.payment_intent,
        client_secret: searchParams.payment_intent_client_secret,
      });
      const body = JSON.stringify({
        checkoutAttributes: checkoutAttributes,
      });
      //console.log(body);

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      })
        .then((res) => res.json())
        .then(({ order }) => {
          if (order) {
            console.log('result: ' + JSON.stringify(order));
          }
        });

      return <SuccessAndRedirect />;
    }
  }
}
