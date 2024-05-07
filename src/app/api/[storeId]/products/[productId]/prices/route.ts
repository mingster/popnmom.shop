import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

//get prices of the given product
export async function GET(req: Request, { params }: { params: { productId: string } }) {
  try {
    if (!params.productId) {
      return new NextResponse('Product id is required', { status: 400 });
    }

    //console.log('GET: ' + params.productId);

    const prices = await prismadb.productPrice.findMany({
      where: {
        productId: params.productId,
      },
      include: {
        currency: true,
      },
    });

    return NextResponse.json(prices);
  } catch (error) {
    console.log('[PRICE_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

async function doUpdate(
  id: string,
  productId: string,
  currencyId: string,
  price: number,
  oldPrice: number,
  isDefault: boolean,
) {
  const priceObj = await prismadb.productPrice.update({
    where: {
      id: id,
    },
    data: {
      price: price,
      oldPrice: oldPrice,
      isDefault: isDefault,
      product: {
        connect: { id: productId },
      },
      currency: {
        connect: { id: currencyId },
      },
    },
  });

  return priceObj;
}

//update price
export async function PATCH(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 405 });
    }

    const body = await req.json();
    const { productPrices } = body;

    //console.log(Array.isArray(productPrices) + 'body: ' + JSON.stringify(productPrices));

    productPrices.map(
      async (
        pp: {
          id: string;
          productId: string;
          currencyId: string;
          price: number;
          oldPrice: number;
          isDefault: boolean;
        },
        index: string,
      ) => {
        await doUpdate(pp.id, pp.productId, pp.currencyId, pp.price, pp.oldPrice, pp.isDefault);
        //console.log(index + ' ' + pp.id + ' ' + pp.currencyId + ' ' + pp.oldPrice );
      },
    );

    /*


    const { price, currency } = body;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 403 });
    }

    if (!params.priceId) {
      return new NextResponse('price id is required', { status: 400 });
    }

    if (!currency) {
      return new NextResponse('currency is required', { status: 400 });
    }
    */
    return NextResponse.json('ok');
  } catch (error) {
    console.error('[PRICE_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
