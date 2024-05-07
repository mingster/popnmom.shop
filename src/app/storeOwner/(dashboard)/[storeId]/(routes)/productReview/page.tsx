import { format } from 'date-fns';

import prismadb from '@/lib/prismadb';
import { formatter } from '@/lib/utils';

import { ProductReviewClient } from './components/client';
import { ProductReviewColumn } from './components/columns';

const ProductReviewPage = async ({ params }: { params: { storeId: string } }) => {
  const reviews = await prismadb.productReview.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      customer: true,
      product: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  const formatted: ProductReviewColumn[] = reviews.map((item) => ({
    id: item.id,
    customerName: item.customer?.name ?? '',
    productName: item.product.name,
    reviewText: item.reviewText ?? '',
    isApproved: item.isApproved,
    rating: item.rating,
    helpfulYesTotal: item.helpfulYesTotal,
    helpfulNoTotal: item.helpfulNoTotal,
    updatedAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductReviewClient data={formatted} />
      </div>
    </div>
  );
};

export default ProductReviewPage;
