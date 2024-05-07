'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useI18n } from '@/providers/i18n-provider';
import { useTranslation } from '@/app/i18n/client';

import { Store } from '@/types/types';
import { getHostname } from '@/lib/utils';
import { Loader } from '@/components/ui/loader';

// ANCHOR check custom domains. if found, redirect to the store.
//
//export default async function Page({ host }: { host: string }) {
export default function Page({}: {}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const router = useRouter();
  const { lng } = useI18n();
  const { t } = useTranslation(lng);

  const routeToStore = async () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/stores/get-by-hostname`;
    const body = JSON.stringify({
      customDomain: getHostname(),
    });

    //console.log(JSON.stringify(body));
    //console.log('url: ' + getHostname());

    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    })
      .then((response) => response.json())
      .then((data) => {
        //console.log('featch result: ' + JSON.stringify(data));
        //if pending order, move on to payment
        const stores = data as Store[];
        //console.log('featch result: ' + JSON.stringify(stores));
        //console.log('store.id: ' + stores[0].id);

        const storeId = stores[0].id;

        if (storeId) {
          const url = `./${storeId}`;
          router.push(url);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(t('err_toaster'));
      });
  };

  if (!mounted) return <></>;
  else {
    if (getHostname() === 'localhost') {
      const redir = `./${process.env.NEXT_PUBLIC_STORE_ID}`;
      //console.log('redir: ' + redir);
      router.push(redir);
    } else {
      //console.log('routeToStore...');
      routeToStore();
    }
  }

  return (
    <div className="w-full">
      <div className="h-screen flex justify-center content-center place-items-center">
        <Loader />
      </div>
    </div>
  );
}
