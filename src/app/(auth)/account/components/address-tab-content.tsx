'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Badge } from '@/components/ui/badge';

import { Address } from 'prisma/prisma-client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useI18n } from '@/providers/i18n-provider';
import { useTranslation } from '@/app/i18n/client';

type props = { addresses: Address[] };

// list user's saved address(es) and provide editing interface
export const AddressTabContent = ({ addresses }: props) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const { lng } = useI18n();
  const { t } = useTranslation(lng, 'account');

  //const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const onDelete = async (addressId: string) => {
    try {
      setLoading(true);

      const userId = session?.user.id;

      const url = `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}/address/${addressId}`;

      await axios.delete(url);
      router.refresh();
      router.push(`/account/?tab=address`);
      toast.success('Address deleted.');
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle></CardTitle>
            <Button onClick={() => router.push(`/account/address/new`)}>
              <Plus className="mr-2 h-4 w-4" /> {t('address_tab_create')}
            </Button>
          </div>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="flex-col">
            <div className="flex-1 space-y-1 p-1 pt-1">
              {addresses.map((address, index) => (
                <div key={index}>
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        <div className="md:grid md:grid-cols-3 gap-1">
                          <label>
                            {address.lastName}&nbsp;
                            {address.firstName} | {address.phoneNumber}
                          </label>
                        </div>
                      </CardTitle>
                      <CardDescription>
                        <label className="pr-2">{address.type}</label>
                        {address.isDefault && (
                          <Badge variant="destructive">{t('address_tab_defaultAddr')}</Badge>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="md:grid md:grid-cols-5 gap-1">
                        <div className="col-start-1 col-span-4">
                          <div className="">
                            <label>{address.streetLine1}</label>
                            <label>{address.streetLine2}</label>
                          </div>
                          <div className="">
                            <label>
                              {address.district},&nbsp;{address.city}&nbsp;{address.postalCode}
                            </label>
                          </div>
                        </div>

                        <div className="col-end-6">
                          <Button
                            className="mr-2"
                            onClick={() => router.push(`/account/address/${address.id}`)}
                          >
                            {t('address_tab_edit')}
                          </Button>
                          <Button onClick={() => onDelete(address.id)}>
                            {t('address_tab_remove')}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter></CardFooter>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </>
  );
};
