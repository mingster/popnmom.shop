import { NextResponse } from 'next/server';
import Stripe from 'stripe';

//create stripe payment intent
export async function POST(req: Request, { params }: { params: { chargeTotal: number } }) {
  //export async function GET(req: NextRequest) {
  try {
    /*
    const tmp = req.nextUrl.searchParams.get('chargeTotal') as string | null;
    //return NextResponse.json({ message: 'hello' });
    */
    if (!params.chargeTotal) {
      return new NextResponse('chargeTotal is required', { status: 400 });
    }
    if (isNaN(params.chargeTotal)) {
      return new NextResponse('chargeTotal is required', { status: 401 });
    }

    const data = await req.json();
    const { currency } = data;

    if (!currency) {
      return new NextResponse('currency is required', { status: 402 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: params.chargeTotal * 100,
      currency: currency,
      automatic_payment_methods: { enabled: true },
    });
    return NextResponse.json(paymentIntent);
  } catch (error) {
    console.log('[STRIPE_payment_intent]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
