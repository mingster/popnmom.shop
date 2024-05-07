import { format } from 'date-fns';

import prismadb from '@/lib/prismadb';
import { formatter } from '@/lib/utils';

import { OrderColumn } from './components/columns';
import { OrderClient } from './components/client';
import { OrderStatus, PaymentStatus } from '@/lib/enum';

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const orders = await prismadb.storeOrder.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItemsWithImage: {
        include: {
          product: true,
        },
      },
      shippingMethod: true,
      paymentMethod: true,
      shipments: true
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  //console.log(JSON.stringify(orders));

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    user: item.userId,
    orderStatus: OrderStatus[item.orderStatus],
    paymentStatus: PaymentStatus[item.paymentStatus],
    //paymentMethod: item.paymentMethod?.name,
    products: item.orderItemsWithImage.map((orderItem) => orderItem.product.name).join(', '),
    /*
    //phone: item.phone,
    //address: item.address,
    totalPrice: formatter.format(item.orderItems.reduce((total, item) => {
      return total + Number(item.product.price)
    }, 0)),
    //isPaid: item.isPaid,
    
    */
    orderTotal: Number(item.orderTotal),
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
