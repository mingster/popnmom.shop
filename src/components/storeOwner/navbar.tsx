//import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from 'next/navigation';
import StoreSwitcher from '@/components/storeOwner/store-switcher';
import { MainNav } from '@/components/storeOwner/main-nav';
import { ThemeToggler } from '@/components/theme-toggler';
import UserProfile from '@/components/auth/user-profile';
import prismadb from '@/lib/prismadb';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

//import { User } from 'prisma/prisma-client';
//import getUser from '@/actions/get-user';

const Navbar = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId) {
    redirect('/api/auth/signin');
  }

  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  });

  //const user = await getUser();

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggler />
          <UserProfile />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
