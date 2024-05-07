import Link from 'next/link';
import { headers } from 'next/headers';

import { ToyBrick, Menu, X } from 'lucide-react';
import { globalStyle } from '@/global-style';

import MainNav from './main-nav';
import MobileNav from './navbarMobile';
import getCategories from '@/actions/get-categories';

import UserProfile from '@/components/auth/user-profile';
import CartDropdown from '@/components/cart-dropdown';
import ThemeToggler from '@/components/theme-toggler';

//import getStore from '@/actions/get-store';
//import getUser from '@/actions/get-user';
//import { User } from 'prisma/prisma-client';
import { User, Store } from '@/types/types';

type props = {
  storeData: Store;
  //user: User;
};

export const Navbar = async ({ storeData }: props) => {
  if (!storeData) {
    throw new Error('no store info.');
  }

  const categories = await getCategories();
  const navbarBackground = 'topnav_gradient2_bg drop-shadow';
  //const user = await getUser();

  //do not show functional components if in checkout or cart page

  let showIcons = true;

  const headersList = headers();
  const domain = headersList.get('host') || '';
  const fullUrl = headersList.get('referer') || '';
  const [pathname] = fullUrl.match(new RegExp(`https?:\/\/${domain}(.*)`)) || [];
  if (pathname?.indexOf('/checkout') != -1 || pathname?.indexOf('/cart') != -1) {
    showIcons = false;
  }

  //console.log('storeData: ' + JSON.stringify(storeData));

  const logoUrl = '/' + storeData.id;

  return (
    <>
      <header className={`${navbarBackground} fixed top-0 z-10 w-full py-0 px-1`}>
        <div className="relative px-0 sm:px-6 lg:px-8 flex h-10 items-center justify-between">
          <div className="flex items-center space-x-4 lg:space-x-6 w-1/6">
            <div className="sm:block hidden">
              {/* logo */}
              <Link href={logoUrl} className="flex items-center gap-2">
                <Menu size={40} className="h-6 w-6 text-[#FFC132] hover:text-[#e4e4e7]" />
                {/*
              <div className="text-[18px] font-bold cursor-pointer flex  text-[#e4e4e7] hover:text-slate">
                <span className="sm:block hidden">LEGOD&nbsp;</span>
              </div>
               */}
              </Link>
            </div>
            <MobileNav data={categories} />
          </div>

          {/* nav for desktop */}
          <MainNav data={categories} />
          {showIcons && (
            <>
              <div className="flex items-center content-end space-x-2">
                <div className="flex items-center">
                  <ThemeToggler />
                </div>
                <div className="flex items-center pr-2">
                  <CartDropdown />
                </div>
                <div className="flex items-center pr-2">
                  <UserProfile />
                </div>
              </div>
            </>
          )}
        </div>
      </header>
    </>
  );
};

export default Navbar;
