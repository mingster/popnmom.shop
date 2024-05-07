import getProduct from '@/actions/get-product';
import SmallCrossCanvas from '../components/SmallCross';
import { SmallCrossContextProvider } from '../components/SmallCrossContext';
import SmallCrossConfigurator from '../components/SmallCrossConfigurator';
import { CartItem } from '@/types/types';
import { ProductPrice } from 'prisma/prisma-client';

export const revalidate = 0;

const Page: React.FC = async ({}) => {
  let productId = process.env.NEXT_PUBLIC_SMCROSS_PRODUCT_ID as string;
  const cartProduct = (await getProduct(productId)) as CartItem;
  if (!cartProduct) throw new Error('product not available');

  //console.log(JSON.stringify(cartProduct));

  const tw_price = cartProduct.productPrices.find((obj: ProductPrice) => obj.currencyId === 'TWD');
  if (!tw_price) {
    throw new Error('You must pass a `price` for new items');
  }
  cartProduct.price = tw_price.price;

  return (
    <div className="py-5 sm:py-0 px-0 mx-auto xl:container rounded min-h-[95%]">
      <SmallCrossContextProvider>
        <SmallCrossCanvas />
        <SmallCrossConfigurator product={cartProduct as CartItem} />
      </SmallCrossContextProvider>
    </div>
  );
};

export default Page;
