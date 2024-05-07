import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { checkAdminAccess } from '@/lib/api_helper';

//get address by its ID
export async function GET(req: Request, { params }: { params: { addressId: string } }) {
  try {
    if (!params.addressId) {
      return new NextResponse('Address is required', { status: 400 });
    }

    const obj = await prismadb.address.findUnique({
      where: {
        id: params.addressId,
      },
    });

    return NextResponse.json(obj);
  } catch (error) {
    console.log('[ADDRESS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { addressId: string; storeId: string } },
) {
  try {
    checkAdminAccess(params.storeId);

    const obj = await prismadb.address.delete({
      where: {
        id: params.addressId,
      },
    });

    return NextResponse.json(obj);
  } catch (error) {
    console.log('[ADDRESS_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { addressId: string; storeId: string } },
) {
  try {
    checkAdminAccess(params.storeId);

    if (!params.addressId) {
      return new NextResponse('Address id is required', { status: 400 });
    }

    const body = await req.json();
    const {
      firstName,
      lastName,
      company,
      streetLine1,
      streetLine2,
      city,
      province,
      postalCode,
      countryId,
      phoneNumber,
      isDefault,
    } = body;

    if (!firstName) {
      return new NextResponse('firstName is required', { status: 400 });
    }
    if (!lastName) {
      return new NextResponse('lastName is required', { status: 400 });
    }
    if (!streetLine1) {
      return new NextResponse('street is required', { status: 400 });
    }
    if (!city) {
      return new NextResponse('city is required', { status: 400 });
    }
    if (!countryId) {
      return new NextResponse('country is required', { status: 400 });
    }

    const obj = await prismadb.address.update({
      where: {
        id: params.addressId,
      },
      data: {
        firstName,
        lastName,
        company,
        streetLine1,
        streetLine2,
        city,
        province,
        postalCode,
        countryId,
        phoneNumber,
        isDefault,
      },
    });

    return NextResponse.json(obj);
  } catch (error) {
    console.log('[ADDRESS_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
