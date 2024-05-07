import { Prisma } from 'prisma/prisma-client';
import { Product } from 'prisma/prisma-client';

export interface CartItem extends Product {
  id: string;
  price: number;
  quantity?: number;
  itemTotal?: number;
  [key: string]: any;

  userData: string;
  cartStatus: CartProductStatus;
}

//this is for customized product...
export enum CartProductStatus {
  InProgress = 0, // customization is work-in-progress
  ReadyToCheckout = 1, //saved in cart, ready to checkout
}

const userObj = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: { orders: true, addresses: true },
});

export type User = Prisma.UserGetPayload<typeof userObj>;

const orderObj = Prisma.validator<Prisma.StoreOrderDefaultArgs>()({
  include: {
    orderItemsWithImage: true,
    shippingMethod: true,
    paymentMethod: true,
    orderNotes: true,
  },
});
export type StoreOrder = Prisma.StoreOrderGetPayload<typeof orderObj>;

const paymethodMappingObj = Prisma.validator<Prisma.StorePaymentMethodMappingDefaultArgs>()({
  include: { paymentMethod: true },
});
export type StorePaymentMethodMapping = Prisma.StorePaymentMethodMappingGetPayload<
  typeof paymethodMappingObj
>;

export const shipmethodMappingObj = Prisma.validator<Prisma.StoreShipMethodMappingDefaultArgs>()({
  include: { shippingMethod: true },
});
export type StoreShipMethodMapping = Prisma.StoreShipMethodMappingGetPayload<
  typeof shipmethodMappingObj
>;

const storeObj = Prisma.validator<Prisma.StoreDefaultArgs>()({
  include: { storeShippingMethods: true, storePaymentMethods: true },
});
export type Store = Prisma.StoreGetPayload<typeof storeObj>;

const revieObj = Prisma.validator<Prisma.ProductReviewDefaultArgs>()({
  include: {
    customer: true,
  },
});
export type ProductReview = Prisma.ProductReviewGetPayload<typeof revieObj>;
