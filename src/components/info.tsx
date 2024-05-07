'use client';
import { ShoppingCart } from 'lucide-react';
import { CartItem } from '@/types/types';

import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import Currency from '@/components/currency';

interface InfoProps {
  data: CartItem;
}

const Info: React.FC<InfoProps> = ({ data }) => {
  const cart = useCart();

  const onAddToCart = () => {
    cart.addItem(data as CartItem);
  };

  return (
    <div className="text-primary">
      <h1 className="text-3xl font-bold text-primary">{data.name}</h1>
      <div className="mt-3 flex items-end justify-between">
        <p className="text-2xl text-primary">
          <Currency value={data?.price} />
        </p>
      </div>
      <hr className="my-4" />
      <div className="flex flex-col gap-y-6">
        {/*
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-primary">Size:</h3>
          <div>{data?.size?.value}</div>
        </div>
 */}
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-primary">Color:</h3>
          <div
            className={cn('h-6 w-6 rounded-full border border-gray-600', {
              backgroundColor: data?.color?.value,
            })}
          />
        </div>
      </div>
      <div className="mt-10 flex items-center gap-x-3">
        <Button className="flex items-center gap-x-2" onClick={onAddToCart}>
          Add To Cart
          <ShoppingCart size={20} />
        </Button>
      </div>
    </div>
  );
};

export default Info;
