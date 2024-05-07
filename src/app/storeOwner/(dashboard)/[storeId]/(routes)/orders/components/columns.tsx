"use client"

import { ColumnDef } from "@tanstack/react-table"

export type OrderColumn = {
  id: string;
  //status: string;
  user: string;
  //phone: string;
  //address: string;
  //isPaid: boolean;
  orderStatus: string;
  paymentStatus: string;
  //paymentMethod: string;
  orderTotal: number;
  products: string;
  createdAt: string;
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "user",
    header: "User",
  },
  {
    accessorKey: "orderStatus",
    header: "Status",
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment Status",
  },

  /*
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
  },

  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  ,
  {
    accessorKey: "isPaid",
    header: "Paid",
  },
  */
  {
    accessorKey: "orderTotal",
    header: "Order Total",
  }
];
