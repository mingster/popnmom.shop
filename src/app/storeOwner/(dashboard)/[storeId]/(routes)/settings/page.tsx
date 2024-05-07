import { redirect } from 'next/navigation';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

import prismadb from '@/lib/prismadb';

import { SettingsForm } from './components/settings-form';

const SettingsPage = async ({ params }: { params: { storeId: string } }) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId) {
    redirect('/api/auth/signin');
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  if (!store) {
    redirect('/');
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
};

export default SettingsPage;
