import { ProductImage } from 'prisma/prisma-client';

const getProductImages = async (): Promise<ProductImage[]> => {
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_STORE_ID}/productImage`;

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

export default getProductImages;