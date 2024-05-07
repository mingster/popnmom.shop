'use client';

import axios from 'axios';
import { Plus, Minus, Edit, MoreHorizontal } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { ProductReviewColumn } from './columns';

interface CellActionProps {
  data: ProductReviewColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();

  //console.log(JSON.stringify(data));

  const onReject = async (reviewId: string) => {
    try {
      setLoading(true);
      const url = `/api/${params.storeId}/productReview/${reviewId}/reject`;
      //console.log('url: ' + url);

      await axios.patch(url);
      router.refresh();
    } catch (error: any) {
      toast.error('Something went wrong.' + error);
    } finally {
      setLoading(false);
      setOpen(false);
      toast.success('Review rejected.');
    }
  };
  const onApprove = async (reviewId: string) => {
    try {
      setLoading(true);
      const url = `/api/${params.storeId}/productReview/${reviewId}/approve`;
      //console.log('url: ' + url);

      await axios.patch(url);

      router.refresh();
    } catch (error: any) {
      toast.error('Something went wrong.' + error);
    } finally {
      setLoading(false);
      setOpen(false);
      toast.success('Review approved.');
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onApprove(data.id)}>
            <Plus className="mr-2 h-4 w-4" /> Approve
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onReject(data.id)}>
            <Minus className="mr-2 h-4 w-4" /> Reject
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/${params.storeId}/productReview/${data.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
