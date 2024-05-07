import { Product } from 'prisma/prisma-client';

const getProduct = async (productId: string): Promise<Product> => {
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_STORE_ID}/products`;
  //const res = await fetch(`${URL}/${id}`);
  //return res.json();

  const env = process.env.NODE_ENV;
  if (env === 'development') {
    const res = await fetch(`${URL}/${productId}`, {
      cache: 'no-store',
    });

    return res.json();
  } else {
    //cache lifetime in 1 hour
    const res = await fetch(`${URL}/${productId}`, { next: { revalidate: 3600 } });
    return res.json();
  }
};

export default getProduct;
