'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ToyBrick } from 'lucide-react';

import { navLinks } from './navLinks';
import { globalStyle } from '@/global-style';
import { cn } from '@/lib/utils';
import useMediaQuery from '@/hooks/use-media-query';
import LandingMobileNavbar from './landing-nav-mobile';
import UserProfile from '@/components/auth/user-profile';
import CartDropdown from '@/components/cart-dropdown';
import { useTranslation } from '@/app/i18n/client';
import { useI18n } from '@/providers/i18n-provider';
//import getUser from '@/actions/get-user';

import { User } from '@/types/types';

type LandingAboutProps = {
  //storeData: Store;
  //user: User;
};

export const LandingNavbar = ({}: LandingAboutProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [active, setActive] = useState('');
  //console.log("active: ", active)
  //const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState(false);
  const [isTopOfPage, setIsTopOfPage] = useState<boolean>(true);
  //const isAboveMediumScreens = useMediaQuery('(min-width: 1060px)');
  const navbarBackground = isTopOfPage
    ? 'topnav_gradient2_bg drop-shadow'
    : 'topnav_gradient_bg drop-shadow';

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
  //console.log('lng: ' + lng);

  if (!mounted) {
    return <></>;
  }

  return (
    <>
      <header
        className={`${navbarBackground} ${globalStyle.flexBetween} fixed top-0 z-10 w-full py-0 px-1`}
      >
        <div className="relative px-0 sm:px-6 lg:px-8 flex h-10 items-center justify-between w-full">
          <div className="flex items-center space-x-4 lg:space-x-6 w-1/6">
            {/* <LandingMobileNavbar /> */}

            {/* logo */}
            <div className="sm:block hidden">
              <Link
                href="#"
                className="flex items-center gap-2 "
                onClick={() => {
                  setActive('');
                  window.scrollTo(0, 0);
                }}
              >
                <ToyBrick
                  size={30}
                  className="w-9 h-9 object-contain text-[#e4e4e7] hover:text-slate"
                />
                <div className="text-[18px] font-bold cursor-pointer flex text-[#e4e4e7] hover:text-slate">
                  LEGOD&nbsp;
                </div>
              </Link>
            </div>
          </div>

          {/* nav for desktop */}
          <nav
            className={`gap-5 px-10 text-sm text-white space-x-4  w-4/6 lg:space-x-6 hidden md:block`}
          >
            {navLinks.map((nav) => (
              <Link
                key={nav.id}
                href={`#${nav.id}`}
                className={cn(active === nav.id ? 'text-slate' : 'text-white', 'hover:text-slate')}
                onClick={() => setActive(nav.id)}
              >
                {t(nav.id)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center content-end space-x-2">
            <div className="flex items-center pr-2">
              <CartDropdown />
            </div>
            <div className="flex items-center pr-2">
              <UserProfile />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
