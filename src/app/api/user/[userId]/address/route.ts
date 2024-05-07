import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

//allow user to get its own address(es)
//***** TODO -- secured this route ****** */
export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    if (!params.userId) {
      return new NextResponse('User is required', { status: 401 });
    }

    /*
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get('userId') + '';
      if (!userId) {
        return new NextResponse('user id is required', { status: 400 });
      }
      const body = await req.json();
      console.log(JSON.stringify(body));
      */

    const addresses = await prismadb.address.findMany({
      where: {
        user: { id: params.userId },
      },
    });

    return NextResponse.json(addresses);
  } catch (error) {
    console.log('[USER_ADDRESS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

//create address

//update address
export async function POST(req: Request, { params }: { params: { userId: string } }) {
  try {
    if (!params.userId) {
      return new NextResponse('User is required', { status: 400 });
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
      type,
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

    const obj = await prismadb.address.create({
      data: {
        user: { connect: { id: params.userId } },
        firstName,
        lastName,
        company,
        streetLine1,
        streetLine2,
        city,
        district,
        province,
        postalCode,
        country: { connect: { alpha3: countryId } },
        phoneNumber,
        type, //HOME | COMPANY | 7-11 | RETURE_ADDRESS | PICKUP_ADDRESS | etc
        reference,
        isDefault,
      },
    });

    return NextResponse.json(obj);
  } catch (error) {
    console.log('[ADDRESS_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
