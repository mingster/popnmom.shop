import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { corsHeaders } from '@/lib/api_helper';
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

//create store
//
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    const body = await req.json();

    const { name, defaultLocale } = body;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    //let defaultLocale = locale;
    //if (!defaultLocale) defaultLocale = 'zh-TW';

    const locale = await prismadb.locale.findUnique({ where: { id: defaultLocale } });
    const defaultCurrency = locale?.defaultCurrencyId;

    const store = await prismadb.store.create({
      data: {
        name,
        userId,
        defaultLocale: defaultLocale!,
        defaultCurrency: defaultCurrency || undefined,
        storeLocales: { create: { localeId: defaultLocale! } }, //create storeLocale record
      },
    });

    return NextResponse.json(store, { headers: corsHeaders });
  } catch (error) {
    console.log('[STORES_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
