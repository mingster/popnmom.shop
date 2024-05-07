import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

// returns all countries currently in db
export async function GET(req: Request) {
  try {
    const countries = await prismadb.country.findMany({ orderBy: { alpha3: 'asc' } });
    return NextResponse.json(countries);
  } catch (error) {
    console.error('[GET_COUNTRIES]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}