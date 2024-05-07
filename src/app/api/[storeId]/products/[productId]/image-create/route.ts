import { NextResponse } from 'next/server';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prismadb from '@/lib/prismadb';

//create product image
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }
    if (!params.productId) {
      return new NextResponse('product is required', { status: 400 });
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
    const { url, publicId } = requestBody;

    if (!url) {
      return new NextResponse('Price is required', { status: 406 });
    }
    if (!publicId) {
      return new NextResponse('publicId is required', { status: 407 });
    }

    const imgObj = await prismadb.productImage.create({
      data: {
        url: url,
        publicId: publicId,
        product: {
          connect: { id: params.productId },
        },
      },
    });

    return NextResponse.json(imgObj);
  } catch (error) {
    console.log('[PRICE_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
