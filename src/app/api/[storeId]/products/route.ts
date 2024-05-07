import { NextResponse } from 'next/server';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prismadb from '@/lib/prismadb';
import { checkAdminAccess } from '@/lib/api_helper';

//create product
export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    checkAdminAccess(params.storeId);

    const body = await req.json();
    const { name, status, categoryId, images, productPrices, isFeatured, productAttribute } = body;

    if (!name) {
      return new NextResponse('Name is required', { status: 405 });
    }

    if (!categoryId) {
      return new NextResponse('Category id is required', { status: 406 });
    }
    /*
    if (!images || !images.length) {
      return new NextResponse('Images are required', { status: 400 });
    }
    */

    const product = await prismadb.product.create({
      data: {
        name,
        isFeatured,
        categoryId,
        status,
        storeId: params.storeId,
        /*
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
        productPrices: {
          createMany: {
            data: [...productPrices],
          },
        },
        */
        productAttribute: {
          create: { ...productAttribute },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

// get products in the store
export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId') || undefined;
    const isFeatured = searchParams.get('isFeatured');

    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        isFeatured: isFeatured ? true : undefined,
      },
      include: {
        images: true,
        category: true,
        productPrices: true,
        productAttribute: true,
        productSpec: { include: { options: true } },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log('[PRODUCT_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
