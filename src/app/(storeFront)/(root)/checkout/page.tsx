import getStore from '@/actions/get-store';
//import { User } from 'prisma/prisma-client';
import getUser from '@/actions/get-user';
import { Checkout } from './component/checkOut';

import { Prisma } from 'prisma/prisma-client';
const storeWithObj = Prisma.validator<Prisma.StoreDefaultArgs>()({
  include: { storeShippingMethods: true, storePaymentMethods: true },
});
type Store = Prisma.StoreGetPayload<typeof storeWithObj>;

export default async function CheckoutPage() {
  const store = (await getStore()) as Store;
  const user = await getUser();

  return <Checkout store={store} user={user} />;
}
