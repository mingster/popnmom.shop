import prismadb from '@/lib/prismadb';

export const getTotalRevenue = async (storeId: string) => {
  const paidOrders = await prismadb.storeOrder.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      orderItemsWithImage: {
        include: {
          product: true,
        },
      },
    },
  });

  const totalRevenue = paidOrders.reduce((total, order) => {
    /*
    const orderTotal = order.orderItems.reduce((orderSum, item) => {
      return orderSum + item.product.price.toNumber();
    }, 0);
    */
    const orderTotal = Number(order.orderTotal);
    return total + orderTotal;
  }, 0);

  return totalRevenue;
};
