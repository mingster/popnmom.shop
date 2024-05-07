import { SuccessAndRedirect } from '../components/success-and-redirect';

// ANCHOR - this page is hit when paypal client confirmed the payment.
// here we show the customer success message and then redirect to account/order page.
export default function Page({ params }: { params: { orderId: string } }) {
  if (!params.orderId) {
    throw new Error('order Id is missing');
  }
  /*
          // ANCHOR clear cart of the order placed
          if (order) {
            //clear cart
            //cart.emptyCart();
            productIds.map((productId) => {
              cart.removeItem(productId);
            });
          }
  */
  return <SuccessAndRedirect />;
}
