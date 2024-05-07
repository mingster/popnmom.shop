'use client';

import { ColumnDef } from '@tanstack/react-table';

import { CellAction } from './cell-action';

export type ProductReviewColumn = {
  id: string;
  customerName: string;
  productName: string;
  reviewText: string;
  isApproved: boolean;
  rating: number;
  helpfulYesTotal: number;
  helpfulNoTotal: number;
  updatedAt: string;
  /*
  title           String?
  reviewText      String?
*/
};

export const columns: ColumnDef<ProductReviewColumn>[] = [
  {
    accessorKey: 'productName',
    header: 'Product',
  },
  {
    accessorKey: 'customerName',
    header: 'Customer',
  },
  {
    accessorKey: 'reviewText',
    header: 'Review',
  },

  {
    accessorKey: 'isApproved',
    header: 'Is Approved',
  },
  {
    accessorKey: 'rating',
    header: 'Rating',
  },
  {
    accessorKey: 'helpfulYesTotal',
    header: 'Helpful Yes',
  },
  {
    accessorKey: 'helpfulNoTotal',
    header: 'Helpful No',
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated at',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
