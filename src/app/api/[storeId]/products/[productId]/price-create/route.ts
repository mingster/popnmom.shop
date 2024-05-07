import { NextResponse } from 'next/server';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prismadb from '@/lib/prismadb';

//create product price
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } },
) {
  //export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    if (!params.productId) {
      return new NextResponse('product is required', { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 401 });
    }
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });
    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 405 });
    }

    const requestBody = await req.json();
    const { price, oldPrice, currencyId, isDefault } = requestBody;

    if (!price) {
      return new NextResponse('Price is required', { status: 402 });
    }
    if (!currencyId) {
      return new NextResponse('currency is required', { status: 403 });
    }

    const priceObj = await prismadb.productPrice.create({
      data: {
        price: price,
        oldPrice: oldPrice,
        isDefault: isDefault,
        product: {
          connect: { id: params.productId },
        },
        currency: {
          connect: { id: currencyId },
        },
      },
    });

    return NextResponse.json(priceObj);
  } catch (error) {
    console.log('[PRICE_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
