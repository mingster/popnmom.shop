import getStore from '@/actions/get-store';
import Navbar from '@/components/storeFront/navbar';
//import Footer from '@/components/storeFront/footer';
//import { User } from 'prisma/prisma-client';
//import getUser from '@/actions/get-user';
//import { Prisma } from 'prisma/prisma-client';
import Container from '@/components/ui/container';
import { Store } from '@/types/types';

export default async function StoreLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  const store = (await getStore()) as Store;

  return (
    <div>
      <Navbar storeData={store} />
      <div className="hash-span" id="top"></div>
      <Container>{children}</Container>
    </div>
  );
}
