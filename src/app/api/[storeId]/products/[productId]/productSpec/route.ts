import { NextResponse } from 'next/server';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prismadb from '@/lib/prismadb';

//create product
export async function POST(
  req: Request,
  { params }: { params: { storeId: string; productId: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;
    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 403 });
    }

    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
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
      return new NextResponse('Product id is required', { status: 400 });
    }

    const body = await req.json();
    const { specName } = body;

    if (!specName) {
      return new NextResponse('specName is required', { status: 400 });
    }

    const productSpec = await prismadb.productSpec.create({
      data: {
        specName: specName,
        product: {
          connect: {
            id: params.productId,
          },
        },
      },
    });

    return NextResponse.json(productSpec);
  } catch (error) {
    console.log('[PRODUCTSPEC_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
