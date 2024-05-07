import { NextResponse } from 'next/server';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prismadb from '@/lib/prismadb';

// get productSpec by id
export async function GET(
  req: Request,
  { params }: { params: { storeId: string; specId: string } },
) {
  try {
    if (!params.specId) {
      return new NextResponse('specId is required', { status: 400 });
    }
    const productSpec = await prismadb.productSpec.findMany({
      where: {
        specId: params.specId,
      },
      include: {
        options: true,
      },
    });

    return NextResponse.json(productSpec);
  } catch (error) {
    console.log('[PRODUCTSPEC_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
