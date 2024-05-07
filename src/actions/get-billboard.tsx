import { Billboard } from 'prisma/prisma-client';

const URL = `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_STORE_ID}/billboards`;

const getBillboard = async (id: string): Promise<Billboard> => {
  const res = await fetch(`${URL}/${id}`);

  return res.json();
};

export default getBillboard;
