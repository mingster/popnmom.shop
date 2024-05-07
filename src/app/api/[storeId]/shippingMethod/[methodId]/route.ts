import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { checkAdminAccess } from '@/lib/api_helper';

//get shipping method by its id
export async function GET(
  req: Request,
  { params }: { params: { storeId: string; methodId: string } },
) {
  try {
    if (!params.methodId) {
      return new NextResponse('Shipping method id is required', { status: 400 });
    }

    const obj = await prismadb.shippingMethod.findUnique({
      where: {
        id: params.methodId,
      },
    });

    return NextResponse.json(obj);
  } catch (error) {
    console.log('[SHIPPINGMETHOD_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

//delete shipping method  by its id
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; methodId: string } },
) {
  try {
    checkAdminAccess(params.storeId);

    if (!params.methodId) {
      return new NextResponse('method id is required', { status: 400 });
    }
    /*
    const obj = await prismadb.shippingMethod.delete({
      where: {
        id: params.methodId,
      },
    });
*/
    const isDeleted = true;
    const obj = await prismadb.shippingMethod.update({
      where: {
        id: params.methodId,
      },
      data: {
        isDeleted,
      },
    });

    return NextResponse.json(obj);
  } catch (error) {
    console.log('[SHIPPINGMETHOD_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

//update product by its id
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; methodId: string } },
) {
  try {
    checkAdminAccess(params.storeId);

    const body = await req.json();
    //console.log('body: ' + JSON.stringify(body));

    const { name, basic_price, description } = body;

    if (!params.methodId) {
      return new NextResponse('methodId is required', { status: 404 });
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 405 });
    }
    if (!basic_price) {
      return new NextResponse('basic_price is required', { status: 406 });
    }

    const obj = await prismadb.shippingMethod.update({
      where: {
        id: params.methodId,
      },
      data: {
        name,
        basic_price,
        description,
      },
    });

    return NextResponse.json(obj);
  } catch (error) {
    console.error('[SHIPPINGMETHOD_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
