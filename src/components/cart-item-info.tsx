import Link from 'next/link';
import Image from 'next/image';
import { Plus, Minus } from 'lucide-react';

import IconButton from '@/components/ui/icon-button';
import Currency from '@/components/currency';
import { useCart } from '@/hooks/use-cart';
import { CartItem } from '@/types/types';
import BigCrossInCartItem from '@/app/(storeFront)/(stores)/[storeId]/(routes)/legod/components/bigCross-cart-item';
import { useI18n } from '@/providers/i18n-provider';
import { useTranslation } from '@/app/i18n/client';

interface cartItemProps {
  item: CartItem;
  showProductImg: boolean;
  showQuantity: boolean;
  showVarity: boolean;
  showSubtotal: boolean;
}

const CartItemInfo: React.FC<cartItemProps> = ({
  item: currentItem,
  showProductImg,
  showQuantity,
  showVarity,
  showSubtotal,
}) => {
  const cart = useCart();
  const { lng } = useI18n();
  const { t } = useTranslation(lng);

  //const defaultBigCross_productId = process.env.NEXT_PUBLIC_BIGCROSS_PRODUCT_ID as string;
  //useEffect(() => {}, [cart, currentItem]);

  if (!currentItem.quantity) currentItem.quantity = 1;

  const handleIncraseQuality = () => {
    let newQuantity = currentItem.quantity ?? 0;
    newQuantity += 1;
    currentItem.quantity = newQuantity;
    cart.updateItemQuantity(currentItem.id, newQuantity);
    //console.log('handleIncraseQuality: ' + currentItem.quantity);
  };

  const handleDecreaseQuality = () => {
    //currentItem.quantity = currentItem.quantity - 1;
    let newQuantity = currentItem.quantity ?? 0;
    newQuantity -= 1;

    if (newQuantity <= 0) {
      const msg = t('cart_itemInfo_removeConfirm');
      if (confirm(msg)) cart.removeItem(currentItem.id);
    } else {
      currentItem.quantity = newQuantity;
      cart.updateItemQuantity(currentItem.id, newQuantity);
    }
    //console.log('handleDecreaseQuality: ' + currentItem.quantity);
  };

  const handleQuantityInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const result = event.target.value.replace(/\D/g, '');
    if (result) cart.updateItemQuantity(currentItem.id, Number(result));
  };
  /*
  const onRemove = () => {
    cart.removeItem(currentItem.id);
  };
*/

  function getLink(id: string, name: string) {
    switch (id) {
      case process.env.NEXT_PUBLIC_BIGCROSS_PRODUCT_ID:
        return (
          <Link
            href={`/${process.env.NEXT_PUBLIC_STORE_ID}/legod/bigcross/`}
            className="hover:text-slate"
          >
            {name}
          </Link>
        );
      case process.env.NEXT_PUBLIC_SMCROSS_PRODUCT_ID:
        return (
          <Link
            href={`/${process.env.NEXT_PUBLIC_STORE_ID}/legod/smcross/`}
            className="hover:text-slate"
          >
            {name}
          </Link>
        );

      default:
        return (
          <Link href={'/product/' + id} className="hover:text-slate">
            {name}
          </Link>
        );
    }
  }
  return (
    currentItem &&
    cart.items.length > 0 && (
      <div className="flex py-6 border-b">
        {currentItem.images.length > 0 && showProductImg && (
          <div className="relative rounded-md overflow-hidden">
            <Image
              fill={false}
              priority={false}
              src={currentItem.images[0].url}
              alt={currentItem.name}
              width={45}
              height={45}
              className="object-cover object-center sm:block hidden"
            />{' '}
          </div>
        )}
        <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
          <div className="relative pr-0 w-full">
            <div className="flex justify-between content-center">
              <div className="flex-none w-1/2 pr-2">
                {getLink(currentItem.id, currentItem.name)}
              </div>

              <div className="pr-1 place-self-end sm:block hidden">
                <Currency value={currentItem.price} />
              </div>

              {showQuantity && (
                <div className="pl-2">
                  <div className="flex">
                    <div className="flex flex-nowrap content-center w-[20px] bg-primary">
                      {currentItem.quantity && currentItem.quantity > 0 && (
                        //{currentItem.quantity > 0 && (
                        <IconButton
                          onClick={handleDecreaseQuality}
                          icon={<Minus size={18} className="text-white" />}
                        />
                      )}
                    </div>
                    <div className="flex flex-nowrap content-center item">
                      <input
                        type="number"
                        className="w-10 text-center border [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="0"
                        value={currentItem.quantity}
                        onChange={handleQuantityInputChange}
                      />
                    </div>
                    <div className="flex flex-nowrap content-center w-[20px] bg-primary">
                      <IconButton
                        onClick={handleIncraseQuality}
                        icon={<Plus size={18} className="text-white" />}
                      />
                    </div>
                  </div>
                </div>
              )}
              {!showQuantity && <div className="pr-2">{currentItem.quantity}</div>}

              {showSubtotal && (
                <>
                  <Currency value={Number(currentItem.quantity * currentItem.price)} />
                </>
              )}
            </div>
          </div>

          <div className="mt-1 flex text-sm">
            {showVarity && <BigCrossInCartItem json_string={currentItem.userData} />}
          </div>
        </div>
      </div>
    )
  );
};

export default CartItemInfo;
