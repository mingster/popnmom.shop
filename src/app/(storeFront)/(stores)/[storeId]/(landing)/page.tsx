import getStore from '@/actions/get-store';
import getProductImages from '@/actions/get-productImages';
import getProductReviews from '@/actions/get-productReviews';
import { Store, ProductReview } from '@/types/types';
import { ProductImage } from 'prisma/prisma-client';
import { LandingAbout } from './components/landing-about';
import { LandingContent } from './components/landing-content';
import { LandingContact } from './components/landing-contact';
import StarsCanvas from '@/components/canvas/StarsCanvas';
import Footer from '@/components/storeFront/footer';

// ANCHOR store's home page (landing page).
//
export default async function LandingPage() {
  const store = (await getStore()) as Store;
  const productImages = (await getProductImages()) as ProductImage[];
  const productReviews = (await getProductReviews()) as ProductReview[];
  //console.log(JSON.stringify(productReviews));
  //console.log(JSON.stringify(store.storeShippingMethods));

  return (
    <>
      <LandingContent pictures={productImages} />
      <LandingAbout storeData={store} reviews={productReviews} />
      <div className="">
        <LandingContact storeData={store} />
        <StarsCanvas />
      </div>

      <Footer storeData={store} />
    </>
  );
}

/*
import { useState, useEffect } from 'react';
import getBillboard from '@/actions/get-billboard';
import getProducts from '@/actions/get-products';
import ProductList from '@/components/product-list';
import Billboard from '@/components/billboard';
import Container from '@/components/ui/container';
import LandingCanvas from '@/components/canvas/LandingCanvas';
//import useStore from '@/hooks/use-store';
//export const revalidate = 0

import type { InferGetStaticPropsType, GetStaticProps } from 'next';

//https://nextjs.org/docs/pages/building-your-application/data-fetching/get-static-props
export const getStaticProps = (async (context) => {
  const store = await getStore();
  //const res = await fetch('https://api.github.com/repos/vercel/next.js')
  //const repo = await res.json()
  return { props: { store } };
}) satisfies GetStaticProps<{
  store: Store;
}>;




const products = await getProducts({isFeatured: true})
  const billboard = await getBillboard(process.env.NEXT_PUBLIC_BILLBOARD_ID)

  return (
    <Container>
      <div className="h-full">
        <div className="space-y-10 pb-10">
          <Billboard data={billboard} />
          <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
            <ProductList title="Featured Products" items={products} />
          </div>
        </div>
      </div>
    </Container>
  )
  */
