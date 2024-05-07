import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

import { corsHeaders } from '@/lib/api_helper';
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

//called by NextAuth callback to obtain user's database ID
export async function POST(req: Request) {
  const body = await req.json();

  const { email, access_token } = body;

  if (!email) {
    return new NextResponse('Unauthenticated', { status: 403 });
  }

  if (!access_token) {
    return new NextResponse('Unauthenticated', { status: 403 });
  }

  //console.log('access_token: ' + access_token);
  const user = await prismadb.user.findUnique({
    where: {
      email: email,
    },
    include: {
      accounts: true,
    },
  });
  return NextResponse.json(user?.id, { headers: corsHeaders });
  /*
  if (user?.accounts[0].access_token === access_token) {
    return NextResponse.json(user?.id, { headers: corsHeaders });
  } else {
    return NextResponse.json('xxxx', { headers: corsHeaders });
  }
  */
}
