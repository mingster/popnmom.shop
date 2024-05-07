import { redirect } from 'next/navigation';
import prismadb from '@/lib/prismadb';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export default async function SetupLayout({ children }: { children: React.ReactNode }) {
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
      userId: user?.id,
    },
  });
  //console.log('store: ' + JSON.stringify(store));

  if (store) {
    redirect(`/storeOwner/${store.id}`);
  }

  return <>{children}</>;
}
