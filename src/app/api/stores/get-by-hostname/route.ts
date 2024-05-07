import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

// returns store by its custom domain name
//
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customDomain } = body;

    if (!customDomain) {
      return new NextResponse('customDomain is required', { status: 400 });
    }

    const store = await prismadb.store.findMany({ where: { customDomain: customDomain } });
    return NextResponse.json(store);
  } catch (error) {
    console.log('[GET_BY_HOSTNAME]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
