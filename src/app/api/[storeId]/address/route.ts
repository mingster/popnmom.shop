import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

import { checkAdminAccess } from '@/lib/api_helper';

//create new address
export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    checkAdminAccess(params.storeId);

    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    /*
    userId      String
  firstName   String
  lastName    String
  company     String?
  countryId   String
  streetLine1 String
  streetLine2 String?
  city        String
  province    String?
  postalCode  String?
  phoneNumber String?
    */
    const body = await req.json();
    const {
      firstName,
      lastName,
      company,
      countryId,
      streetLine1,
      streetLine2,
      city,
      province,
      postalCode,
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

    const obj = await prismadb.address.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        company: company,
        streetLine1: streetLine1,
        streetLine2: streetLine2,
        city: city,
        province: province,
        postalCode: postalCode,
        country: { connect: { alpha3: countryId } },
        phoneNumber: phoneNumber,
        isDefault: isDefault,
        user: { connect: { id: userId } },
      },
    });

    return NextResponse.json(obj);
  } catch (error) {
    console.log('[ADDRESS_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
