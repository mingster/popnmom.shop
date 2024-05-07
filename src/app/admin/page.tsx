import { useState, Suspense } from 'react';
import { Loader } from '@/components/ui/loader';

//
//
export default async function AdminPage() {
  return (
    <div className="">
      <Suspense fallback={<Loader />}>
        
        admin
      </Suspense>
    </div>
  );
}