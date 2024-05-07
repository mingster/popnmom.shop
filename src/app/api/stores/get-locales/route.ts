import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

// returns all locales currently in db
export async function GET(req: Request) {
  try {
    const locales = await prismadb.locale.findMany({ orderBy: { id: 'asc' } });
    return NextResponse.json(locales);
  } catch (error) {
    console.log('[GET_LOCALES]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}