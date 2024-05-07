'use client';
import { forwardRef } from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

import { cn } from '@/lib/utils';

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    /*
    <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)} {...props}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            route.active ? 'text-black dark:text-white' : 'text-muted-foreground',
          )}
        >
          {route.title}
        </Link>
      ))}
    </nav>
    */
    <AdminNavigationMenu />
  );
}

export function AdminNavigationMenu() {
  const adminPath = '/storeOwner';

  const pathname = usePathname();
  const params = useParams();
  const overviewRoutes = [
    {
      href: `${adminPath}/${params.storeId}`,
      title: 'Overview',
      active: pathname === `${adminPath}/${params.storeId}`,
      description: '',
    },
  ];
  const offeringRoutes = [
    {
      href: `${adminPath}/${params.storeId}/products`,
      title: 'Products',
      description: '',
    },
    {
      href: `${adminPath}/${params.storeId}/crossSell`,
      title: 'Cross Sell',
      description: '',
    },
    {
      href: `${adminPath}/${params.storeId}/tierSell`,
      title: 'Tier Sell / Group sell',
      description: '',
    },
    {
      href: `${adminPath}/${params.storeId}/productReview`,
      title: 'Product reviews and approval',
      description: 'manage customer reviews.',
    },
  ];
  const salesRoutes = [
    {
      href: `${adminPath}/${params.storeId}/orders`,
      title: 'Orders',
      description: '',
    },
    {
      href: `${adminPath}/${params.storeId}/shipping`,
      title: 'Shipment',
      description: '',
    },
  ];
  const marketingRoutes = [
    {
      href: `${adminPath}/${params.storeId}/productReview`,
      title: 'Product reviews and approval',
      description: 'manage customer reviews.',
    },
  ];

  const contentRoutes = [
    {
      href: `${adminPath}/${params.storeId}/categories`,
      title: 'Categories',
      description: '',
    },
    {
      href: `${adminPath}/${params.storeId}/billboards`,
      title: 'Billboards',
      description: '',
    },
  ];

  const settingRoutes = [
    {
      href: `${adminPath}/${params.storeId}/settings`,
      title: 'Store settings',
      description: 'general store settings',
    },
    {
      href: `${adminPath}/${params.storeId}/settings/country`,
      title: 'Country',
      description: 'manage countries that can make purchases in this store.',
    },
    {
      href: `${adminPath}/${params.storeId}/settings/currency`,
      title: 'Currency',
      description: 'manage currencies that can make purchases in this store.',
    },
    {
      href: `${adminPath}/${params.storeId}/settings/locale`,
      title: 'Locale',
      description: 'manage supported locales in this store.',
    },
    /*
    ,
    {
      href: `${adminPath}/${params.storeId}/settings/paymentMethod`,
      title: 'Payment Method',
      description: 'manage payment methods supported in this store.',
    },
    {
      href: `${adminPath}/${params.storeId}/settings/shippingMethod`,
      title: 'Shipping Method',
      description: 'manage shipping methods supported in this store.',
    },*/
  ];

  const systemRoutes = [
    {
      href: `${adminPath}/system/country`,
      title: 'Country',
      description: 'manage system-wide country data.',
    },
    {
      href: `${adminPath}/system/currency`,
      title: 'Currency',
      description: 'manage system-wide currency data.',
    },
    {
      href: `${adminPath}/system/locale`,
      title: 'Locale',
      description: 'manage system-wide locale data.',
    },
    {
      href: `${adminPath}/system/paymentMethod/`,
      title: 'Payment Method',
      description: 'manage system-wide payment methods.',
    },
    {
      href: `${adminPath}/system/shippingMethod/`,
      title: 'Shipping Method',
      description: 'manage system-wide shipping methods.',
    },
  ];

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="./" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Overview
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        {/*
        <NavigationMenuItem>
          <NavigationMenuTrigger>OverView</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-2 md:w-[300px] lg:w-[300px] lg:grid-cols-[.75fr_1fr]">
              {overviewRoutes.map((route) => (
                <ListItem key={route.title} title={route.title} href={route.href}>
                  {route.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        */}

        <NavigationMenuItem>
          <NavigationMenuTrigger>Offering</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-2 md:w-[300px] lg:w-[300px] lg:grid-cols-[.75fr_1fr]">
              {offeringRoutes.map((route) => (
                <ListItem key={route.title} title={route.title} href={route.href}>
                  {route.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Sales</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-2 p-2 md:w-[400px] md:grid-cols-3 lg:w-[500px] justify-end">
              {salesRoutes.map((route) => (
                <ListItem key={route.title} title={route.title} href={route.href}>
                  {route.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Marketing</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-2 p-2 md:w-[400px] md:grid-cols-3 lg:w-[500px] justify-end">
              {marketingRoutes.map((route) => (
                <ListItem key={route.title} title={route.title} href={route.href}>
                  {route.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Content</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-2 p-2 md:w-[400px] md:grid-cols-3 lg:w-[500px] justify-end">
              {contentRoutes.map((route) => (
                <ListItem key={route.title} title={route.title} href={route.href}>
                  {route.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Settings</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-2 p-2 md:w-[400px] md:grid-cols-3 lg:w-[500px] justify-end">
              {settingRoutes.map((route) => (
                <ListItem key={route?.title} title={route?.title} href={route?.href}>
                  {route?.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>System</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-2 p-2 md:w-[400px] md:grid-cols-3 lg:w-[500px] justify-end">
              {systemRoutes.map((route) => (
                <ListItem key={route.title} title={route.title} href={route.href}>
                  {route.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/docs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Documentation
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  },
);
ListItem.displayName = 'ListItem';
