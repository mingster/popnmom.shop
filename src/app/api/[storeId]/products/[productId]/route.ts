import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { checkAdminAccess } from '@/lib/api_helper';

//get product by its id
export async function GET(req: Request, { params }: { params: { productId: string } }) {
  try {
    if (!params.productId) {
      return new NextResponse('Product id is required', { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true,
        productPrices: true,
        productAttribute: true,
        productSpec: { include: { options: true } },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

//delete product by its id
export async function DELETE(
  req: Request,
  { params }: { params: { productId: string; storeId: string } },
) {
  try {
    checkAdminAccess(params.storeId);

    if (!params.productId) {
      return new NextResponse('Product id is required', { status: 404 });
    }

    const product = await prismadb.product.delete({
      where: {
        id: params.productId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

//update product by its id
export async function PATCH(
  req: Request,
  { params }: { params: { productId: string; storeId: string } },
) {
  try {
    checkAdminAccess(params.storeId);

    if (!params.productId) {
      return new NextResponse('Product id is required', { status: 404 });
    }

    const body = await req.json();
    //console.log('body: ' + JSON.stringify(body));

    const { name, status, categoryId, isFeatured, productAttribute } = body;

    if (!name) {
      return new NextResponse('Name is required', { status: 405 });
    }
    if (!categoryId) {
      return new NextResponse('Category id is required', { status: 406 });
    }

    const product = await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        status,
        categoryId,
        isFeatured,
        productAttribute: {
          update: { ...productAttribute },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('[PRODUCT_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
