import { redirect } from 'next/navigation';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

import Navbar from '@/components/storeOwner/navbar';
import prismadb from '@/lib/prismadb';

export default async function DashboardLayout({
  children,
  //params,
}: {
  children: React.ReactNode;
  //params: { storeId: string };
}) {
  const session = await getServerSession(authOptions);
  //console.log('session: ' + JSON.stringify(session));
  //console.log('userid: ' + userId);

  const email = session?.user.email;
  if (!email) {
    redirect('/api/auth/signin');
  }

  const user = await prismadb.user.findUnique({
    where: {
      email: email,
    },
  });
  //console.log('userId: ' + user?.id);
  /*
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId: user?.id,
    },
  });
  //console.log('store: ' + JSON.stringify(store));
*/
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
