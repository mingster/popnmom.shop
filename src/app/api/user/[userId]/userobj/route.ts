import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

// for /account page, get user data with addresses and orders
//
export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    if (!params.userId) {
      return new NextResponse('User is required', { status: 401 });
    }

    /*
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get('userId') + '';
      if (!userId) {
        return new NextResponse('user id is required', { status: 400 });
      }
      const body = await req.json();
      console.log(JSON.stringify(body));
      */

    const obj = await prismadb.user.findUnique({
      where: {
        id: params.userId,
      },
      include: {
        addresses: true,
        orders: {
          include: {
            orderItemsWithImage: true,
            orderNotes: true,
            shippingMethod: true,
            paymentMethod: true,
          },
          orderBy: {
            updatedAt: 'desc',
          },
        },
      },
    });

    return NextResponse.json(obj);
  } catch (error) {
    console.error('[USER_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
