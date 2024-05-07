import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { corsHeaders } from '@/lib/api_helper';
import { OrderStatus, PaymentStatus, ReturnStatus, ShippingStatus } from '@/lib/enum';
import { DialogPortal } from '@radix-ui/react-dialog';
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

//create an pending order
//
export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  if (!params.storeId) {
    return new NextResponse('storeId is required', { status: 400 });
  }
  //console.log('storeId: ' + params.storeId);

  const data = await req.json();
  //console.log('data: ' + JSON.stringify(data));

  //those are minimum required fields
  const { productIds, prices, quantities, userId, orderTotal, shippingMethodId } = data;
  //console.log('data: ' + productIds + userId, orderTotal);

  if (!productIds || productIds.length === 0) {
    return NextResponse.json({ success: false, message: 'Product is required.' }, { status: 400 });
  }
  if (!userId) {
    return NextResponse.json({ success: false, message: 'userId is required.' }, { status: 401 });
  }

  if (!orderTotal) {
    return NextResponse.json(
      { success: false, message: 'orderTotal is required.' },
      { status: 402 },
    );
  }

  if (!shippingMethodId) {
    return NextResponse.json(
      { success: false, message: 'shippingMethodId is required.' },
      { status: 403 },
    );
  }

  //console.log('data: ' + JSON.stringify(data));

  //create order in db
  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  //console.log(JSON.stringify(products));
  /*
  let checkoutAttribute = data.checkoutAttributes;
  if (!checkoutAttribute) {
    checkoutAttribute = '';
  }
  */

  const order = await prismadb.storeOrder.create({
    data: {
      storeId: params.storeId,
      userId: userId,
      isPaid: false,
      orderTotal: orderTotal,
      currency: data.currency,
      orderItems: {
        createMany: {
          data: products.map((product, index: number) => ({
            productId: product.id,
            quantity: quantities[index],
            unitPrice: prices[index],
          })),
        },
      },
      orderNotes: {
        createMany: {
          data: data.notes.map((note: string) => ({ note: note, displayToCustomer: true })),
        },
      },
      shippingMethodId: shippingMethodId,
      shippingAddress: data.shippingAddress,
      shippingCost: data.shippingCost,
      paymentStatus: Number(PaymentStatus.Pending),
      returnStatus: Number(ReturnStatus.None),
      shippingStatus: Number(ShippingStatus.NotYetShipped),
      orderStatus: Number(OrderStatus.Pending),
      paymentMethodId: data.paymentMethodId,
      checkoutAttributes: data.checkoutAttributes,
    },
  });

  //console.log('order: ' + JSON.stringify(order));
  return NextResponse.json({ order }, { headers: corsHeaders });
}
