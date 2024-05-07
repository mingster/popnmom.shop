export type ProductStatusT = {
  value: number;
  label: string;
};
export enum ProductStatus {
  Draft = 0,
  Published = 1,
  Archived = 20,
  Deleted = 30,
}

export const ProductStatuses: ProductStatusT[] = [
  {
    value: ProductStatus.Draft,
    label: 'Draft',
  },
  {
    value: ProductStatus.Published,
    label: 'Published',
  },
  {
    value: ProductStatus.Archived,
    label: 'Archived',
  },
];

export enum OrderStatus {
  Pending = 10,
  Processing = 20,
  InShipping = 30,
  Completed = 40,
  Refund = 50,
  Cancelled = 100,
}

export enum PaymentStatus {
  Pending = 10,
  SelfPickup = 11,
  Authorized = 20,
  Paid = 30,
  PartiallyRefunded = 40,
  Refunded = 50,
  Voided = 60,
}
/*
export enum ShippingMethod {
  FreeShipping = 10,
  FlatRate = 20,
  LocalPickup = 30,
  LocalDelivery = 40,
}
*/
export enum ShippingStatus {
  ShippigNotRequired = 0,
  NotYetShipped = 10,
  PartiallyShipped = 20,
  Shipped = 30,
  Delivered = 40,
}

export enum ReturnStatus {
  None = 0,
  Pending = 10,
  Received = 20,
  ReturnAuthorized = 30,
  ItemRepaired = 40,
  ItemRefunded = 50,
  RequestRejected = 60,
  Cancelled = 70,
}

export enum PaymentMethod {
  Stripe = 10,
  PayPal = 20,
  ReturnAuthorized = 30,
  ItemRepaired = 40,
  ItemRefunded = 50,
  RequestRejected = 60,
  Cancelled = 70,
}
