'use client';

import usePreviewModal from '@/hooks/use-preview-modal';
import Gallery from '@/components/gallery';
import Info from '@/components/info';
import { CartItem } from '@/types/types';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const PreviewModal = () => {
  const previewModal = usePreviewModal();
  const product = usePreviewModal((state) => state.data) as CartItem;

  if (!product) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
          <div className="sm:col-span-4 lg:col-span-5">
            <Gallery images={product.images} />
          </div>
          <div className="sm:col-span-8 lg:col-span-7">
            <Info data={product} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;