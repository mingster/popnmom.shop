'use client';

import { useState, Suspense } from 'react';
import { startTransition, useTransition } from 'react';

import { Loader } from '@/components/ui/loader';
import { populateCountryData } from '@/actions/admin/populate-country-data';
import { populateCurrencyData } from '@/actions/admin/populate-currency-data';
import {
  create_shippingMethods,
  create_paymentMethods,
  create_locales,
} from '@/actions/admin/populate-payship_defaults';
import { Separator } from '@/components/ui/separator';

//initialize this app
//
export default function InstallPage() {
  return (
    <div className="justify-center flex flex-col w-full h-full">
      <Suspense fallback={<Loader />}>
        <PopulateDataButton action={populateCountryData} dataToPopulate="Country" />
        <Separator />

        <PopulateDataButton action={populateCurrencyData} dataToPopulate="Currency" />
        <Separator />

        <PopulateDataButton action={create_locales} dataToPopulate="Locales" />
        <PopulateDataButton action={create_paymentMethods} dataToPopulate="payment methods" />
        <PopulateDataButton action={create_shippingMethods} dataToPopulate="shipping methods" />
      </Suspense>
    </div>
  );
}
interface PopulateDataButtonProps {
  //onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  action: any;
  dataToPopulate: string;
}
const PopulateDataButton: React.FC<PopulateDataButtonProps> = ({ action, dataToPopulate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    startTransition(() => {
      // 👇️ prevent page refresh
      event.preventDefault();

      setIsLoading(true);

      const populateData = async () => {
        if (!isCompleted) await action();
      };
      populateData().then(() => {
        setIsCompleted(true);
      });
      console.log('completed');
    });
  };

  if (isPending) {
    return 'Loading...';
  } else {
    return (
      <div className="pt-10">
        Populate {dataToPopulate}:
        <button
          type="submit"
          onClick={handleClick}
          disabled={isLoading || isCompleted}
          className={
            isCompleted
              ? 'bg-gray-500 text-gray py-2 px-4 border border-blue-700 rounded'
              : 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded'
          }
        >
          {isCompleted ? dataToPopulate + ' data populated' : 'Click to start'}
        </button>
      </div>
    );
  }
};
