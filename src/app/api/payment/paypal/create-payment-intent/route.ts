import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

import client from '@/lib/paypal_client';
import paypal from '@paypal/checkout-server-sdk';

// ANCHOR called by /payment/[orderId]/paypal/paymentPaypal, we will create an pending order that hooks with paypal payment process.
//
export async function POST(req: Request) {
  const data = await req.json();
  //console.log('data: ' + JSON.stringify(data));

  // required fields
  const { currency, orderId } = data;
  //console.log('data: ' + productIds + userId, orderTotal);

  if (!currency) {
    return new NextResponse('currency is required', { status: 403 });
  }

  if (!orderId) {
    return new NextResponse('orderId is required', { status: 400 });
  }

  const order = await prismadb.storeOrder.findUnique({
    where: {
      id: orderId,
    },
  });

  if (!order) {
    return new NextResponse('correct order is required', { status: 401 });
  }

  if (!order.orderTotal) {
    return NextResponse.json(
      { success: false, message: 'orderTotal is required.' },
      { status: 402 },
    );
  }

  //create paypal payment intent
  try {
    const PaypalClient = client();

    //This code is lifted from https://github.com/paypal/Checkout-NodeJS-SDK
    const request = new paypal.orders.OrdersCreateRequest();
    request.headers['Prefer'] = 'return=representation';
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: order.orderTotal + '',
          },
        },
      ],
    });

    // your client gets a response with the order id
    const response = await PaypalClient.execute(request);
    //console.log(`Response: ${JSON.stringify(response)}`);

    const paymentIntentId = response.result.id;
    //console.log('create-order api orderID: ' + orderID);

    if (paymentIntentId) {
      // ANCHOR record the paymentIntentId in the checkoutAttributes column in our database
      //
      const order = await prismadb.storeOrder.update({
        where: {
          id: orderId,
        },
        data: {
          checkoutAttributes: paymentIntentId,
        },
      });

      return NextResponse.json({ paymentIntentId: paymentIntentId });
    }
  } catch (err) {
    console.error('error: ' + err);

    return NextResponse.json(
      { success: false, message: 'paypal error occured at backend.' },
      { status: 500 },
    );
  }
}
