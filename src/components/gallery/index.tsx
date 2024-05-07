'use client';

import NextImage from 'next/image';
import { ProductImage } from 'prisma/prisma-client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { cn } from '@/lib/utils';
import GalleryTab from './gallery-tab';

interface GalleryProps {
  images: ProductImage[];
}

const Gallery: React.FC<GalleryProps> = ({ images = [] }) => {
  return (
    <>
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList>
          {images.map((image) => (
            <GalleryTab key={image.id} image={image} />
          ))}
        </TabsList>

        {images.map((image) => (
          <TabsContent key={image.id} value={image.id}>
            <div className="aspect-square relative h-full w-full sm:rounded-lg overflow-hidden">
              <NextImage fill src={image.url} alt="Image" className="object-cover object-center" />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
};

export default Gallery;
