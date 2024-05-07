import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

// returns all currencies currently in db
export async function GET(req: Request) {
  try {
    const currencies = await prismadb.currency.findMany({
      select: {
        id: true,
        name: true,
        symbolNative: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    //const currencies = await prismadb.currency.findMany({ orderBy: { id: 'asc' } });

    return NextResponse.json(currencies);
  } catch (error) {
    console.log('[GET_CURRENCIES]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
