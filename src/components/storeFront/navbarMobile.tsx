'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Category } from 'prisma/prisma-client';

import UserProfile from '@/components/auth/user-profile';
import CartDropdown from '@/components/cart-dropdown';
import ThemeToggler from '@/components/theme-toggler';
interface MobileNavProps {
  data: Category[];
}

const MobileNav: React.FC<MobileNavProps> = ({ data }) => {
  //const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");
  //const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false);

  const pathname = usePathname();
  const routes = data.map((route) => ({
    href: `/category/${route.id}`,
    label: route.name,
    active: pathname === `/category/${route.id}`,
  }));

  return (
    <Sheet>
      <SheetTrigger>
        <div className="md:hidden rounded-full  w-8 h-8 bg-[#915EFF] text-white object-contain p-1">
          <Menu size={40} className="h-6 w-6 md:hidden text-[#FFC132]" />
        </div>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-tertiary text-white">
        <nav className="flex flex-col gap-4">
          {/* MENU ITEMS */}

          <div className="ml-[33%] flex flex-col gap-10 items-center">
            <Link href="/" className={cn('hover:text-secondary')}>
              HOME
            </Link>
            {/*
            {routes.length != 0 && (
              
              <>
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      'hover:text-secondary',
                      route.active ? 'text-secondary' : 'text-white',
                    )}
                  >
                    {route.label}
                  </Link>
                ))}
              </>
               
            )}
            */}
          </div>
          <div className="flex items-center content-end space-x-2">
            <ThemeToggler />
            <CartDropdown />
            <UserProfile />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
