import Navbar from '@/components/storeFront/navbar';
import Footer from '@/components/storeFront/footer';
import Container from '@/components/ui/container';

import getStore from '@/actions/get-store';
//import getUser from '@/actions/get-user';
//import { User } from 'prisma/prisma-client';
import { Store } from '@/types/types';

export default async function AuthLayout({
  // Layouts must accept a children prop. This will be populated with nested layouts or pages
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

      <Footer storeData={store} />
    </div>
  );
}
