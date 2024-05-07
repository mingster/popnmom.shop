import Container from '@/components/ui/container';
import { StoreOrder } from 'prisma/prisma-client';
import getStoreOrder from '@/actions/get-storeOrder';
import PaymentStripe from './components/payment-stripe';

const PaymentPage = async ({ params }: { params: { orderId: string } }) => {
  //console.log('orderId: ' + params.orderId);

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

  const order = (await getStoreOrder(params.orderId)) as StoreOrder;
  //console.log(JSON.stringify(order));

  return (
    <div className="pt-10">
      <Container>
        <PaymentStripe order={order} />
      </Container>
    </div>
  );
};

export default PaymentPage;
