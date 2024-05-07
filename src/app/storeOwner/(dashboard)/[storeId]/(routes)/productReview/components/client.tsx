'use client';

import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { ApiList } from '@/components/ui/api-list';

import { ProductReviewColumn, columns } from './columns';

interface ProductReviewClientProps {
  data: ProductReviewColumn[];
}

export const ProductReviewClient: React.FC<ProductReviewClientProps> = ({ data }) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Product Reviews (${data.length})`}
          description="Manage product Reviews for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/productReview/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="productName" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Product Review" />
      <Separator />
      <ApiList entityName="productReview" entityIdName="productReviewId" />
    </>
  );
};
