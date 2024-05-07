import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

//return orderItemWithImageView objct by orderid
export async function GET(req: Request, { params }: { params: { orderId: string } }) {
  try {
    if (!params.orderId) {
      return new NextResponse('orderId is required', { status: 400 });
    }

    const items = await prismadb.orderItemWithImageView.findMany({
      where: {
        orderId: params.orderId,
      }
    });

    return NextResponse.json(items);
  } catch (error) {
    console.log('[ORDERITEM_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
