import { NextResponse } from 'next/server';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prismadb from '@/lib/prismadb';

export const corsHeaders = {
  //'Access-Control-Allow-Origin': '*',
  //'Access-Control-Allow-Methods': 'POST, PUT, PATCH, GET, DELETE, OPTIONS',
  //'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  //'Access-Control-Allow-Credentials': 'true',
  'Content-Type': 'application/json',
  Allow: 'POST, PUT, PATCH, GET, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'Access-Control-Allow-Headers, Access-Control-Allow-Methods, Origin, Accept, X-Requested-With, Authorization, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
};

// ensure logged-in user has access to the store
//
export const checkAdminAccess = async (storeId: string) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  if (!storeId) {
    return new NextResponse('Store id is required', { status: 400 });
  }
  if (!userId) {
    return new NextResponse('Unauthenticated', { status: 401 });
  }

  const storeByUserId = await prismadb.store.findFirst({
    where: {
      id: storeId,
      userId,
    },
  });

  if (!storeByUserId) {
    return new NextResponse('Unauthorized', { status: 402 });
  }
};
