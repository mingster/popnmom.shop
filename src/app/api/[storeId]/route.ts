import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

//return store objct by id
export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }

    const store = await prismadb.store.findUnique({
      where: {
        id: params.storeId,
      },
      include: {
        storeShippingMethods: { include: { shippingMethod: true } },
        storePaymentMethods: { include: { paymentMethod: true } },
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log('[STORE_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
