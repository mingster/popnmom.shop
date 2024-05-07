import { NextResponse } from 'next/server';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prismadb from '@/lib/prismadb';

//create productReview
export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    /*
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
    */
    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }

    const body = await req.json();
    const { customerId, productId, title, reviewText, rating } = body;

    const review = await prismadb.productReview.create({
      data: {
        customerId: customerId,
        productId: productId,
        storeId: params.storeId,
        isApproved: false,
        title: title,
        reviewText: reviewText,
        rating: rating,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.log('[PRODUCTREVIEW_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

//get productReview in this store
export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId') || undefined;
    const customerId = searchParams.get('customerId') || undefined;
    const tmp = searchParams.get('isApproved') + '';
    const isApproved = /^\s*(true|1|on)\s*$/i.test(tmp);

    //console.log('isApproved: ' + tmp + ' ' + isApproved);

    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }

    const reviews = await prismadb.productReview.findMany({
      where: {
        storeId: params.storeId,
        productId: productId,
        customerId: customerId,
        isApproved: isApproved,
      },
      include: {
        product: true,
        customer: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.log('[PRODUCTREVIEW_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
