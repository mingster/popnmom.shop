import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

//get images of the given product
export async function GET(req: Request, { params }: { params: { productId: string } }) {
  try {
    if (!params.productId) {
      return new NextResponse('Product id is required', { status: 400 });
    }

    //console.log('GET: ' + params.productId);

    const images = await prismadb.productImage.findMany({
      where: {
        productId: params.productId,
      },
      include: {},
    });

    return NextResponse.json(images);
  } catch (error) {
    console.log('[IMAGES_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

async function doUpdate(
  publicId: string,
  name: string,
  description: string,
  shownInLandingPage: boolean,
) {
  const imgObj = await prismadb.productImage.update({
    where: {
      publicId: publicId,
    },
    data: {
      name: name,
      description: description,
      shownInLandingPage: shownInLandingPage,
    },
  });

  return imgObj;
}

//update images
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
    const { productImages } = body;

    //console.log(Array.isArray(productPrices) + 'body: ' + JSON.stringify(productPrices));

    productImages.map(
      async (
        img: {
          id: string;
          productId: string;
          url: string;
          publicId: string;
          name: string;
          description: string;
          shownInLandingPage: boolean;
        },
        index: string,
      ) => {
        await doUpdate(img.publicId, img.name, img.description, img.shownInLandingPage);
        //console.log(index + ' ' + pp.id + ' ' + pp.currencyId);
      },
    );

    return NextResponse.json('ok');
  } catch (error) {
    console.error('[IMAGES_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
