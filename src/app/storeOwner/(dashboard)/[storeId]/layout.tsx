import { redirect } from 'next/navigation';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

import Navbar from '@/components/storeOwner/navbar';
import prismadb from '@/lib/prismadb';
import Sidebar from '@/components/storeOwner/side-bar';

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
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

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId: user?.id,
    },
  });
  //console.log('store: ' + JSON.stringify(store));

  if (!store) {
    console.log('user has no store...');
    redirect('/storeOwner');
  }

  return (
    <>
      <Navbar />
      <div className="flex">
        <div>
          <Sidebar />
        </div>
        <div>{children}</div>
      </div>
    </>
  );
}
