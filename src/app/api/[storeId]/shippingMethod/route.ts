import { NextResponse } from 'next/server';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prismadb from '@/lib/prismadb';
import { checkAdminAccess } from '@/lib/api_helper';

//create ShippingMethod
export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    checkAdminAccess(params.storeId);

    const body = await req.json();
    const { name, description, basic_price, currencyId, countryId } = body;

    if (!name) {
      return new NextResponse('Name is required', { status: 405 });
    }
    if (!basic_price) {
      return new NextResponse('basic_price is required', { status: 406 });
    }
    if (!currencyId) {
      return new NextResponse('currencyId is required', { status: 407 });
    }
    if (!countryId) {
      return new NextResponse('countryId is required', { status: 408 });
    }

    const obj = await prismadb.shippingMethod.create({
      data: {
        name,
        description,
        basic_price,
        currency: {
          connect: { id: currencyId },
        },
        /*
        shippingMethodCountryMapping: {
          createMany: {
            data: {
              countryId: countryId,
            },
          },
        },
        */
      },
    });

    return NextResponse.json(obj);
  } catch (error) {
    console.log('[SHIPPINGMETHOD_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

//get shipping method in this store
//
export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const obj = await prismadb.shippingMethod.findMany({
      where: {
        stores: {
          some: {
            storeId: params.storeId,
          },
        },
      },
    });

    return NextResponse.json(obj);
  } catch (error) {
    console.log('[SHIPPINGMETHOD_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
