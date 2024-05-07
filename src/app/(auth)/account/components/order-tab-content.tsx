'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@mui/material';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderStatus, PaymentStatus, ShippingStatus, ReturnStatus } from '@/lib/enum';
import { useI18n } from '@/providers/i18n-provider';
import { useTranslation } from '@/app/i18n/client';

import { StoreOrder } from '@/types/types';
import { format } from 'date-fns/format';

/*
const getOrderItems = async (orderId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_STORE_ID}/storeOrder/orderItem/${orderId}`;
  console.log(url);
  return (await axios.get(url).then((response) => response.data)) as OrderItem[];
};
*/
type orderTabProps = { orders: StoreOrder[]; status: OrderStatus };
export const DisplayOrders = ({ orders, status }: orderTabProps) => {
  const router = useRouter();

  const { lng } = useI18n();
  const { t } = useTranslation(lng, 'account');

  //console.log('order items: ' + JSON.stringify(orders));
  const buyAgain = async (orderId: string) => {};
  const pay = async (orderId: string, payurl: string) => {
    const url = `/payment/${orderId}/${payurl}`;
    //console.log(url);
    router.push(url);
  };

  const contactSeller = () => {
    router.push('/#contact');
  };

  return (
    <>
      <div className="flex-col">
        <div className="flex-1 space-y-1 p-1 pt-1">
          {orders.map((order: StoreOrder, index) => (
            <div key={index}>
              {order.orderStatus === status && (
                <Card key={index}>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-1 justify-items-stretch">
                      <div className="whitespace-nowrap flex">
                        {/*order items */}
                        {order.orderItemsWithImage.map((item, index2) => (
                          <>
                            {/*
                        item.url && (
                          <Image
                            fill={false}
                            priority={false}
                            src={item.url}
                            alt={item.name}
                            width={25}
                            height={25}
                            className="w-25 h-25"
                          />
                        )
                       */}

                            <div key={index2} className="flex items-center">
                              <label className="pr-2">{item.name}</label>
                              <div className="text-xs">
                                <label className="pr-2">x{item.quantity}</label>
                              </div>
                              <div className="text-xs">
                                <label>${Number(item.unitPrice)}</label>
                              </div>
                            </div>
                          </>
                        ))}
                      </div>
                      <div></div>
                      <div className="justify-self-end whitespace-nowrap">
                        {format(order.createdAt, 'yyyy/MM/dd')}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1 justify-items-stretch">
                      <div className="whitespace-nowrap flex">
                        <div className="sm:block hidden">
                          <div className="pr-2">{order.shippingAddress}</div>
                        </div>
                        {t('ShippingStatus_' + ShippingStatus[order.shippingStatus])}
                      </div>
                      <div className="sm:block hidden justify-self-end">
                        {t('shippingCost_label')}
                      </div>
                      <div className="sm:block hidden justify-self-end">
                        ${Number(order.shippingCost)}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1 justify-items-stretch">
                      <div className="whitespace-nowrap">{order.shippingMethod.name}</div>
                      <div className="sm:block hidden justify-self-end">{t('tax_label')}</div>
                      <div className="sm:block hidden justify-self-end">
                        ${Number(order.orderTax)}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1 justify-items-stretch">
                      <div className="">
                        {/*t('PaymentStatus_' + PaymentStatus[order.paymentStatus])*/}
                      </div>
                      <div className="justify-self-end whitespace-nowrap">
                        {t('orderTotal_label')}
                      </div>
                      <div className="justify-self-end whitespace-nowrap">
                        ${Number(order.orderTotal)} {order.currency}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {status === OrderStatus.Pending && (
                      <Button
                        className="mr-2"
                        size="sm"
                        onClick={() =>
                          order.paymentMethod && pay(order.id, order.paymentMethod.payUrl)
                        }
                      >
                        {t('order_tab_pay')}
                      </Button>
                    )}
                    {status === OrderStatus.Completed && (
                      <Button className="mr-2" size="sm" onClick={() => buyAgain(order.id)}>
                        {t('order_tab_buyAgain')}
                      </Button>
                    )}
                    <Button size="sm" onClick={() => contactSeller()}>
                      {t('order_tab_contact_seller')}
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

type props = { orders: StoreOrder[] };
export const OrderTabContent = ({ orders }: props) => {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('ordertab');
  const [activeTab, setActiveTab] = useState(initialTab || OrderStatus[OrderStatus.Completed]);

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
  const keys = Object.keys(OrderStatus).filter((v) => isNaN(Number(v)));
  const vals = Object.keys(OrderStatus).filter((v) => !isNaN(Number(v)));
  //console.log(keys);

  const { lng } = useI18n();
  const { t } = useTranslation(lng, 'account');

  return (
    <Tabs
      value={activeTab}
      defaultValue="orders"
      onValueChange={handleTabChange}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-6 xs:grid-cols-3">
        {keys.map((key, index) => (
          <TabsTrigger key={index} value={key}>
            {/*<Badge badgeContent= color="primary"></Badge>*/}
            {t('OrderStatus_' + key)}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={OrderStatus[OrderStatus.Pending]}>
        <DisplayOrders orders={orders} status={OrderStatus.Pending} />
      </TabsContent>
      <TabsContent value={OrderStatus[OrderStatus.Processing]}>
        <DisplayOrders orders={orders} status={OrderStatus.Processing} />
      </TabsContent>
      <TabsContent value={OrderStatus[OrderStatus.InShipping]}>
        <DisplayOrders orders={orders} status={OrderStatus.InShipping} />
      </TabsContent>
      <TabsContent value={OrderStatus[OrderStatus.Completed]}>
        <DisplayOrders orders={orders} status={OrderStatus.Completed} />
      </TabsContent>
      <TabsContent value={OrderStatus[OrderStatus.Refund]}>
        <DisplayOrders orders={orders} status={OrderStatus.Refund} />
      </TabsContent>
      <TabsContent value={OrderStatus[OrderStatus.Cancelled]}>
        <DisplayOrders orders={orders} status={OrderStatus.Cancelled} />
      </TabsContent>
    </Tabs>
  );
};
