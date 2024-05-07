import prismadb from '@/lib/prismadb';
import { ProductReviewForm } from './components/product-review-form';

const ReviewEditPage = async ({ params }: { params: { reviewId: string; storeId: string } }) => {
  const reviewToEdit = await prismadb.productReview.findUnique({
    where: {
      id: params.reviewId,
    },
    include: {},
  });

  //console.log('ReviewEditPage: ' + JSON.stringify(reviewToEdit));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductReviewForm initialData={reviewToEdit} />
      </div>
    </div>
  );
};

export default ReviewEditPage;
