import getProduct from '@/actions/get-product';
import BigCrossCanvas from '../components/BigCross';
import { BigCrossContextProvider } from '../components/BigCrossContext';
import BigCrossConfigurator from '../components/BigCrossConfigurator';
import { CartItem } from '@/types/types';
import { ProductPrice } from 'prisma/prisma-client';

//export const revalidate = 0;

const BigCrossPage: React.FC = async ({}) => {
  /*
  CAN ONLY DO THIS ON CLIENT SIDE
  import { useCart } from '@/hooks/use-cart';
  const cart = useCart();
  const existingItem = cart.items.find((item) => item.name === '客製大十字');
  console.log(JSON.stringify(existingItem));
  */

  let productId = process.env.NEXT_PUBLIC_BIGCROSS_PRODUCT_ID as string;
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
      <BigCrossContextProvider>
        <BigCrossCanvas />
        <BigCrossConfigurator product={cartProduct as CartItem} />
      </BigCrossContextProvider>
    </div>
  );
};

export default BigCrossPage;
