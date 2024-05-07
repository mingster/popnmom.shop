'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import { fallbackLng, languages, cookieName } from '@/app/i18n/settings';
import { CookiesProvider, useCookies } from 'react-cookie';
//import { Prisma } from 'prisma/prisma-client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Container from '@/components/ui/container';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LocaleSelectItems } from '@/components/locale-select-items';

import { useI18n } from '@/providers/i18n-provider';
import { useTranslation } from '@/app/i18n/client';

import { AddressTabContent } from './address-tab-content';
import { OrderTabContent } from './order-tab-content';
import { User, StoreOrder } from '@/types/types';

type props = { user: User };

export const AccountTabs = ({ user }: props) => {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(initialTab || 'orders'); //show order tab by default

  const handleTabChange = (value: string) => {
    //update the state
    setActiveTab(value);
    // update the URL query parameter
    //router.push({ query: { tab: value } });
  };

  // if the query parameter changes, update the state
  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);
  //console.log('selectedTab: ' + activeTab);

  const { lng } = useI18n();
  const { t } = useTranslation(lng, 'account');

  const [cookies, setCookie] = useCookies([cookieName]); //https://github.com/bendotcodes/cookies/tree/main/packages/react-cookie
  const handleChangeLanguage = (value: string) => {
    //console.log('change language to: ' + value);
    setCookie(cookieName, value);
  };

  return (
    <main>
      <Tabs
        value={activeTab}
        defaultValue="orders"
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="orders">{t('account_tabs_orders')}</TabsTrigger>
          <TabsTrigger value="address">{t('account_tabs_address')}</TabsTrigger>
          <TabsTrigger value="account">{t('account_tabs_account')}</TabsTrigger>
          <TabsTrigger value="password">{t('account_tabs_password')}</TabsTrigger>
        </TabsList>
        <TabsContent value="orders">
          <OrderTabContent orders={user.orders as StoreOrder[]} />
        </TabsContent>
        <TabsContent value="address">
          <AddressTabContent addresses={user.addresses} />
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle></CardTitle>
              <CardDescription>
                {t('account_tab_currentAcct')} {session?.user.email}
                {
                  // if user doesn't have email, show its userid
                  !session?.user.email && session?.user.id
                }
                &nbsp;&nbsp;
                <Button variant="link" onClick={() => signOut()}>
                  {t('account_tab_signout')}
                </Button>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {/*
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Pedro Duarte" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="@peduarte" />
              </div>
              */}
              <div className="space-y-1">
                <Label>{t('account_tabs_language')}</Label>
                <Select
                  //disabled={loading}
                  onValueChange={handleChangeLanguage}
                  defaultValue={lng}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a default locale" />
                  </SelectTrigger>

                  <SelectContent>
                    <LocaleSelectItems />
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              {/*
              <Button>Save changes</Button>
              */}
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle></CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Current password</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
};
