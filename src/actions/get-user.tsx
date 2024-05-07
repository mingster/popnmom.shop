import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
//import { User } from 'prisma/prisma-client';
import { User } from '@/types/types';

const getUser = async (): Promise<User | null> => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  //get user with needed assoicated objects
  //
  const userid = session?.user.id;
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/user/${userid}/userobj`;

  //const user = (await axios.get(URL).then((response) => response.data)) as User;
  //console.log(JSON.stringify(user));

  const env = process.env.NODE_ENV;

  if (env === 'development') {
    const res = await fetch(`${URL}`, {
      cache: 'no-store',
      /*
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        */
    });

    return res.json();
  } else {
    //cache lifetime in 1 hour
    const res = await fetch(`${URL}`, { next: { revalidate: 3600 } });
    return res.json();
  }
};

export default getUser;
