'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useMediaQuery from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import { Category } from 'prisma/prisma-client';

interface MainNavProps {
  data: Category[];
}

const MainNav: React.FC<MainNavProps> = ({ data }) => {
  //const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");
  //const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false);

  const pathname = usePathname();

  const routes = data.map((route) => ({
    href: `/category/${route.id}`,
    label: route.name,
    active: pathname === `/category/${route.id}`,
  }));
  /*
    const aboutRoute = {
      href: '/signin',
      label: '登入',
      active: pathname === '/signin',
    }
    routes.push(aboutRoute);
  */
  return (
    <>
      {/* desktop 
      //<nav className={`gap-5 px-10 text-sm text-white space-x-4  w-4/6 lg:space-x-6 hidden md:block`}>
      <nav className={`gap-5 px-10 text-sm text-primary space-x-4  w-4/6 lg:space-x-6 hidden md:block`}>
        {routes.map(route => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              'hover:text-secondary',
              route.active ? 'text-secondary' : 'text-primary'
            )}
          >
            {route.label}
          </Link>
        ))}
      </nav>
      */}
    </>
  );
};

export default MainNav;
