'use client';
import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Moon, ShoppingCart, Sun } from 'lucide-react';
import { navLinks } from './navLinks';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/app/i18n/client';
import { useI18n } from '@/providers/i18n-provider';

const LandingMobileNavbar = () => {
  const [active, setActive] = useState('');
  //console.log("active: ", active)
  //const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false);

  const [scrolled, setScrolled] = useState(false);
  const [isTopOfPage, setIsTopOfPage] = useState<boolean>(true);
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 100) {
        setScrolled(true);
        setIsTopOfPage(false);
      } else {
        setIsTopOfPage(true);
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { lng } = useI18n();
  const { t } = useTranslation(lng);

  return (
    <>
      <Sheet>
        <SheetTrigger>
          <div className="md:hidden rounded-full  w-8 h-8 bg-[#915EFF] text-white object-contain p-1">
            <Menu size={20} className="h-6 w-6 md:hidden text-[#FFC132]" />
          </div>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-tertiary text-primary">
          <nav className="flex flex-col gap-4">
            {/* MENU ITEMS */}
            <div className="ml-[33%] flex flex-col gap-10 text-2xl text-primary">
              <Link
                href="#"
                className="flex items-center gap-2 "
                onClick={() => {
                  setActive('');
                  window.scrollTo(0, 0);
                }}
              >
                top
              </Link>
              {navLinks.map((nav) => (
                <Link
                  key={nav.id}
                  href={`#${nav.id}`}
                  className={cn(
                    active === nav.id ? 'text-slate' : 'text-primary',
                    'hover:text-secondary',
                  )}
                  onClick={() => setActive(nav.id)}
                >
                  {t(nav.id)}
                </Link>
              ))}
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default LandingMobileNavbar;
