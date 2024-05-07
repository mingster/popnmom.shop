import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prismadb from '@/lib/prismadb';
import { corsHeaders } from '@/lib/api_helper';

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

/*
export async function GET(req: Request, { params }: { params: { orderId: string } }) {
  try {
    if (!params.orderId) {
      return new NextResponse('orderId id is required', { status: 400 });
    }

    const order = await prismadb.storeOrder.findUnique({
      where: {
        id: params.orderId,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.log('[ORDER_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { orderId: string } }) {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId) {
    return new NextResponse('Unauthenticated', { status: 403 });
  }

  if (!params.orderId) {
    return new NextResponse('Order id is required', { status: 400 });
  }

  const order = await prismadb.storeOrder.delete({
    where: {
      id: params.orderId,
    },
  });

  return NextResponse.json(order);
}
*/
