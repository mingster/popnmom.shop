//import Head from 'next/head';
import type { Metadata, ResolvingMetadata } from 'next';

import { LandingNavbar } from './components/landing-navbar';
import { LandingHero } from './components/landing-hero';

import getStore from '@/actions/get-store';
import getUser from '@/actions/get-user';
import Container from '@/components/ui/container';
//import { User } from 'prisma/prisma-client';
import { Store } from '@/types/types';

/*
type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const id = params.id;

  // fetch data
  const product = await fetch(`https://.../${id}`).then((res) => res.json());

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: product.title,
    openGraph: {
      images: ['/some-specific-page-image.jpg', ...previousImages],
    },
  };
}
*/

export default async function LandingLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  const store = (await getStore()) as Store;
  //const user = (await getUser()) as User;

  return (
    <>
      <LandingNavbar />
      <span className="hash-span" id="top">
        &nbsp;
      </span>

      <LandingHero storeData={store} />
      {/*bg-hero-pattern bg-cover bg-repeat bg-center */}
      <div className=" bg-black">
        <main>{children}</main>
      </div>
    </>
  );
}
