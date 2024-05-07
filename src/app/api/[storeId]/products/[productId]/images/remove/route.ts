import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

//delete product image by publicId
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; productId: string } },
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

    if (!params.productId) {
      return new NextResponse('productId id is required', { status: 407 });
    }

    const body = await req.json();
    //console.log(JSON.stringify(body));

    const { publicId } = body;

    if (!publicId) {
      return new NextResponse('publicId id is required', { status: 406 });
    }

    const imageObj = await prismadb.productImage.delete({
      where: {
        publicId: publicId,
      },
    });

    return NextResponse.json('success: 1');
  } catch (error) {
    console.log('[PRICE_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
