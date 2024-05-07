import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

import { corsHeaders } from '@/lib/api_helper';
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

//get all products images in the store where shownInLandingPage is true
export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }

    const images = await prismadb.productImageView.findMany({
      where: {
        storeId: params.storeId,
        shownInLandingPage: true,
      },
    })

    return NextResponse.json(images, { headers: corsHeaders });
  } catch (error) {
    console.log('[IMAGES_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
