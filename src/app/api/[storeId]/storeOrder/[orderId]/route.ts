import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

//return StoreOrder objct by orderid
export async function GET(req: Request, { params }: { params: { orderId: string } }) {
  try {
    if (!params.orderId) {
      return new NextResponse('orderId is required', { status: 400 });
    }

    const obj = await prismadb.storeOrder.findUnique({
      where: {
        id: params.orderId,
      },
      /*
      select: {
        isPaid: true,
        orderTotal: true,
        shippingMethod: true,
        paymentMethod: true,
      },
      */
      include: {
        user: true,
        shippingMethod: true,
        paymentMethod: true,
      },
    });

    return NextResponse.json(obj);
  } catch (error) {
    console.log('[StoreOrder_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
