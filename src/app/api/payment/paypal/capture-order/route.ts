//import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import paypal from '@paypal/checkout-server-sdk';
import client from '@/lib/paypal_client';
import prismadb from '@/lib/prismadb';
import { OrderStatus, PaymentStatus } from '@/lib/enum';
/*
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
*/

// ANCHOR - Capture paypal's order status. If completed, mark the order as paid.
//
// LINK -  https://github.com/paypal/Checkout-NodeJS-SDK/blob/develop/samples/CaptureIntentExamples/captureOrder.js
export async function POST(req: Request) {
  if (req.method != 'POST')
    return NextResponse.json({ success: false, message: '' }, { status: 500 });

  const data = await req.json();
  //console.log('data: ' + JSON.stringify(data));
  const { orderID } = data; // this is paypal payment intent id

  if (!orderID || orderID.length === 0) {
    return NextResponse.json({ success: false, message: 'orderID is required.' }, { status: 400 });
  }

  //Capture order to complete payment
  const PaypalClient = client();
  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  //request.requestBody({});

  const captureData = await PaypalClient.execute(request);
  if (!captureData) {
    return NextResponse.json(
      { success: false, message: 'paypal error occured at backend.' },
      { status: 500 },
    );
  }
  //console.log('response: ' + JSON.stringify(response));

  // ANCHOR - if the paypal order is approved, make our order as paid
  //
  const status = captureData?.result.status;

  //console.log('status: ' + JSON.stringify(status));

  if (status === 'COMPLETED') {
    const payment_id = captureData?.result.id;
    const email_address = captureData?.result.payer.email_address;
    const payer_id = captureData?.result.payer.payer_id;
    const checkoutRef =
      '{payment_id:' +
      payment_id +
      ',email_address:' +
      email_address +
      ',payer_id=' +
      payer_id +
      '}';

    const THEorder = await prismadb.storeOrder.findFirst({
      where: {
        checkoutAttributes: orderID,
      },
    });

    if (THEorder) {
      // Your Custom Code to Update Order Status
      const order = await prismadb.storeOrder.update({
        where: {
          id: THEorder?.id,
        },
        data: {
          isPaid: true,
          orderStatus: OrderStatus.Processing,
          paymentStatus: PaymentStatus.Paid,
          checkoutRef: checkoutRef,
        },
      });
    }
  }

  //return the response
  return NextResponse.json({ captureData }, { status: 200 });
}
