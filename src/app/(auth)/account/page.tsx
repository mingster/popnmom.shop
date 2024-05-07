import { redirect } from 'next/navigation';
import { AccountTabs } from './components/account-tabs';

import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { User } from '@/types/types';
import getUser from '@/actions/get-user';

/*
import { cache, use } from 'react';
type User = {
  id: number;
  name: string;
  email: string;
};
  let users = use<User[]>(getUsers());
const getUsers = cache(() =>
  fetch('https://jsonplaceholder.typicode.com/users').then((res) => res.json()),
);
*/
export default async function AccountPage(
  {
    //params,
  } //  children,
  : {
    //children: React.ReactNode;
    //params: { storeId: string };
  },
) {
  /*
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const userid = session?.user.id;

  console.log('session.user: ' + JSON.stringify(session.user));
  console.log('userid: ' + userid);
*/

  const user = await getUser();
  if (!user) {
    redirect('/api/auth/signin');
  } else {
    const u: User = user as User;
    return <AccountTabs user={u} />;
  }
}
