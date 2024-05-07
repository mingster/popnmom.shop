import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function PATCH(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    const body = await req.json();

    const {
      name,
      description,
      logo,
      logoPublicId,
      privacyPolicy,
      tos,
      aboutUs,
      aboutUsVideoUrl,
      lineId,
      facebookUrl,
      igUrl,
      showcsAddress,
      showcsPhoneNumber,
      showcsEmail,
      csAddress,
      csPhoneNumber,
      csEmail,
      customDomain,
      defaultLocale,
      defaultCountry,
    } = body;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 403 });
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }

    const locale = await prismadb.locale.findUnique({ where: { id: defaultLocale } });
    const defaultCurrency = locale?.defaultCurrencyId;

    const store = await prismadb.store.update({
      where: {
        id: params.storeId,
        userId,
      },
      data: {
        name,
        description,
        logo,
        logoPublicId,
        privacyPolicy,
        tos,
        aboutUs,
        aboutUsVideoUrl,
        lineId,
        facebookUrl,
        igUrl,
        showcsAddress,
        showcsPhoneNumber,
        showcsEmail,
        csAddress,
        csPhoneNumber,
        csEmail,
        customDomain,
        defaultLocale: defaultLocale!,
        defaultCountry: defaultCountry!,
        defaultCurrency: defaultCurrency || undefined,
        storeLocales: {
          upsert: {
            // create or update storeLocale record
            create: { localeId: defaultLocale! },
            update: { localeId: defaultLocale! },
            where: { storeId_localeId: { storeId: params.storeId, localeId: defaultLocale } },
          },
        },
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log('[STORE_PATCH]', error);
    return new NextResponse('Internal error' + error, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 403 });
    }

    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }

    const store = await prismadb.store.deleteMany({
      where: {
        id: params.storeId,
        userId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log('[STORE_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
