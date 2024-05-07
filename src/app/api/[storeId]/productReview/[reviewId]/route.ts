import { NextResponse } from 'next/server';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prismadb from '@/lib/prismadb';

//update the given productReview
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; reviewId: string } },
) {
  try {
    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }

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

    //console.log('storeID: ' + params.storeId);
    //console.log('review id: ' + params.reviewId);

    const body = await req.json();
    const { isApproved, title, reviewText, rating } = body;

    const review = await prismadb.productReview.update({
      where: {
        id: params.reviewId,
      },
      data: {
        isApproved: isApproved,
        title: title,
        reviewText: reviewText,
        rating: rating,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.log('[PRODUCTREVIEW_REJECT]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
