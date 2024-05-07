import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { corsHeaders } from '@/lib/api_helper';
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

//***** TODO -- secured this route ****** */
export async function GET(req: Request, { params }: { params: { addressId: string } }) {
  if (!params.addressId) {
    return new NextResponse('addressId is required', { status: 401 });
  }

  const obj = await prismadb.address.findUnique({
    where: {
      id: params.addressId,
    },
  });

  return NextResponse.json(obj, { headers: corsHeaders });

  /*
  try {

  } catch (error) {
    console.log('[ADDRESS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
  */
}

//update address
// this MUST be a POST because client does not allow PATCH operation
//
export async function POST(
  req: Request,
  { params }: { params: { addressId: string; userId: string } },
) {
  try {
    if (!params.userId) {
      return new NextResponse('User is required', { status: 400 });
    }

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
      district,
      province,
      postalCode,
      countryId,
      phoneNumber,
      type, //HOME | COMPANY | 7-11 | RETURE_ADDRESS | PICKUP_ADDRESS | etc
      reference,
      isDefault,
    } = body;

    if (!firstName) {
      return new NextResponse('firstName is required', { status: 400 });
    }
    if (!lastName) {
      return new NextResponse('lastName is required', { status: 400 });
    }
    if (!phoneNumber) {
      return new NextResponse('street is required', { status: 400 });
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

    //ensure the user only have 1 default
    if (isDefault) {
      await prismadb.address.updateMany({
        where: {
          userId: params.userId,
        },
        data: { isDefault: false },
      });
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
        district,
        province,
        postalCode,
        country: {
          connect: { alpha3: countryId },
        },
        phoneNumber,
        type, //HOME | COMPANY | 7-11 | RETURE_ADDRESS | PICKUP_ADDRESS | etc
        reference,
        isDefault,
      },
    });

    return NextResponse.json(obj);
    //return NextResponse.json(obj, { headers: corsHeaders });
  } catch (error) {
    console.error('[ADDRESS_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

//delete address
export async function DELETE(
  req: Request,
  { params }: { params: { addressId: string; userId: string } },
) {
  try {
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
