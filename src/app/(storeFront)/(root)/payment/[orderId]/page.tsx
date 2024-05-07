import axios from 'axios';
import { redirect } from 'next/navigation';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { StoreOrder } from 'prisma/prisma-client';
import getStoreOrder from '@/actions/get-storeOrder';

const PaymentPage = async ({ params }: { params: { orderId: string } }) => {
  console.log('orderId: ' + params.orderId);

  if (!params.orderId) {
    throw new Error('order Id is missing');
  }

  /*
  const session = await getServerSession(authOptions);
  if (!session) {
    //if (status != 'authenticated') {
    redirect('/api/auth/signin');
  }
  //get user with needed assoicated objects
  //
  const userId = session?.user.id;
  */

  //get order
  //const url = `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_STORE_ID}/storeOrder/${params.orderId}`;
  //console.log('URL: ' + url);

  const order = (await getStoreOrder(params.orderId)) as StoreOrder;
  //console.log(JSON.stringify(order));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6"></div>
    </div>
  );
};

export default PaymentPage;
