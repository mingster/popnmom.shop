import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

//delete price
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; productId: string; currencyId: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 403 });
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

    if (!params.currencyId) {
      return new NextResponse('currencyId id is required', { status: 400 });
    }

    if (!params.productId) {
      return new NextResponse('productId id is required', { status: 400 });
    }
    const priceObjToDel = await prismadb.productPrice.findUnique({
      where: {
        currencyId_productId: {
          productId: params.productId,
          currencyId: params.currencyId,
        },
      },
    });

    if (!priceObjToDel) {
      return new NextResponse('price not found', { status: 400 });
    }

    const priceObj = await prismadb.productPrice.delete({
      where: {
        id: priceObjToDel?.id,
      },
    });

    return NextResponse.json('success: 1');
  } catch (error) {
    console.log('[PRICE_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
