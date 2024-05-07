import axios from 'axios';
import { redirect } from 'next/navigation';
import { Session, getServerSession } from 'next-auth';

import { authOptions } from '@/lib/authOptions';
import { AddressForm } from './components/address-form';
import { Address } from 'prisma/prisma-client';

const AddressEditPage = async ({ params }: { params: { addressId: string } }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    //if (status != 'authenticated') {
    redirect('/api/auth/signin');
  }

  //get user with needed assoicated objects
  //
  const userId = session?.user.id;
  const url = `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}/address/${params.addressId}`;

  //console.log('userId: ' + userId);
  //console.log('URL: ' + url);

  //let address: Address | null = null;
  const address = (await axios.get(url).then((response) => response.data)) as Address;

  //console.log(JSON.stringify(address));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <AddressForm initialData={address} userId={userId} />
      </div>
    </div>
  );
};

export default AddressEditPage;
