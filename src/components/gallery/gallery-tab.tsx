import NextImage from 'next/image';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { ProductImage } from 'prisma/prisma-client';

interface GalleryTabProps {
  image: ProductImage;
}

const GalleryTab: React.FC<GalleryTabProps> = ({ image }) => {
  return (
    <>
      <TabsTrigger value={image.id}>
        <span className="absolute h-full w-full aspect-square inset-0 overflow-hidden rounded-md">
          <NextImage fill src={image.url} alt="" className="object-cover object-center" />
        </span>
        <span className={cn('absolute inset-0 rounded-md ring-2 ring-offset-2 ring-transparent')} />
      </TabsTrigger>
    </>
  );
};

export default GalleryTab;
