import { StoreOrder } from 'prisma/prisma-client';

const getStoreOrder = async (orderId: string): Promise<StoreOrder> => {
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_STORE_ID}/storeOrder`;

  const env = process.env.NODE_ENV;
  if (env === 'development') {
    const res = await fetch(`${URL}/${orderId}`, {
      cache: 'no-store',
    });

    return res.json();
  } else {
    //cache lifetime in 1 hour
    const res = await fetch(`${URL}/${orderId}`, { next: { revalidate: 3600 } });
    return res.json();
  }
};

export default getStoreOrder;
