import { NextResponse } from 'next/server';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prismadb from '@/lib/prismadb';
import { checkAdminAccess } from '@/lib/api_helper';

//create ShippingMethodMapping
export async function POST(
  req: Request,
  { params }: { params: { storeId: string; methodId: string } },
) {
  try {
    checkAdminAccess(params.storeId);

    const body = await req.json();

    const obj = await prismadb.storeShipMethodMapping.create({
      data: {
        storeId: params.storeId,
        methodId: params.methodId,
      },
    });

    return NextResponse.json(obj);
  } catch (error) {
    console.log('[SHIPPINGMETHODMAPPING_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

//delete ShippingMethodMapping of giving store and ship method
//
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; methodId: string } },
) {
  try {
    checkAdminAccess(params.storeId);

    const obj = await prismadb.storeShipMethodMapping.delete({
      where: {
        storeId_methodId: {
          storeId: params.storeId,
          methodId: params.methodId,
        },
      },
    });

    return NextResponse.json(obj);
  } catch (error) {
    console.log('[SHIPPINGMETHODMAPPING_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
