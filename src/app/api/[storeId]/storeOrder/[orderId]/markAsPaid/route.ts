import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { corsHeaders } from '@/lib/api_helper';
import { OrderStatus, PaymentStatus, ReturnStatus, ShippingStatus } from '@/lib/enum';
import { DialogPortal } from '@radix-ui/react-dialog';
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// mark order as paid
//
export async function POST(req: Request, { params }: { params: { storeId: string, orderId: string } }) {
  if (!params.storeId) {
    return new NextResponse('storeId is required', { status: 400 });
  }
  if (!params.orderId) {
    return new NextResponse('orderId is required', { status: 401 });
  }

  const data = await req.json();
  //console.log('data: ' + JSON.stringify(data));

  //those are minimum required fields
  const { checkoutAttributes } = data;
  
  if (!checkoutAttributes) {
    return new NextResponse('checkoutAttributes is required', { status: 402 });
  }

  const order = await prismadb.storeOrder.update({
    where: {
      id: params.orderId,
    },
    data: {
      isPaid: true,
      orderStatus: Number(OrderStatus.Processing),
      paymentStatus: Number(PaymentStatus.Paid),
      checkoutAttributes: checkoutAttributes,
    },
  });

  //console.log('order: ' + JSON.stringify(order));
  return NextResponse.json({ order }, { headers: corsHeaders });
}
