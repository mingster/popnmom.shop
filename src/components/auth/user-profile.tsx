'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Role } from 'prisma/prisma-client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
//import useMediaQuery from '@/hooks/use-media-query';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useI18n } from '@/providers/i18n-provider';
import { useTranslation } from '@/app/i18n/client';

type props = {
  /*user: User*/
};

//display user avatar if signed in; otherwise displays sign-in / sign-out buttons
//
export const UserProfile = ({}: props) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const router = useRouter();
  const { lng } = useI18n();
  const { t } = useTranslation(lng);

  const { data: session } = useSession();
  //const isAboveMediumScreens = useMediaQuery('(min-width: 1060px)');

  if (!mounted) return <></>;

  const defaultPic = '/user.png';
  let pic = defaultPic;
  if (session) {
    pic = session?.user.image;
  }
  if (!pic) pic = defaultPic;

  const user = session?.user;

  //console.log('isAboveMediumScreens: ', isAboveMediumScreens);
  //console.log('session: ', session);
  //console.log('pic: ', pic);

  return (
    <>
      {session === null ? (
        <>
          <Link
            title={t('user_profile_signIn')}
            key="signin"
            onClick={() => signIn()}
            href="#"
            className="hover:text-secondary text-white text-sm"
          >
            {t('user_profile_signIn')}
          </Link>
        </>
      ) : (
        <>
          <div className="pr-1">
            <DropdownMenu>
              <DropdownMenuTrigger>
                {pic && (
                  <Image
                    src={pic}
                    alt="avatar"
                    className="px-0 py-0 flex items-center rounded-full bg-tertiary w-30 h-30"
                    width={20}
                    height={20}
                    onClick={() => router.push('/account')}
                  />
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => router.push('/account')}
                >
                  {t('user_profile_myAccount')}
                </DropdownMenuItem>

                {user?.role === Role.STORE_OWNER && (
                  <>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => router.push('/storeFront')}
                    >
                      {t('user_profile_linkTo_storeFront')}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => router.push('/storeOwner')}
                    >
                      {t('user_profile_linkTo_storeOwner')}
                    </DropdownMenuItem>
                  </>
                )}
                {user?.role === Role.ADMIN && (
                  <>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => router.push('/storeFront')}
                    >
                      {t('user_profile_linkTo_storeFront')}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => router.push('/storeOwner')}
                    >
                      {t('user_profile_linkTo_storeOwner')}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => router.push('/admin')}
                    >
                      {t('user_profile_linkTo_admin')}
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuItem onClick={() => signOut()}>
                  {t('user_profile_signOut')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      )}
    </>
  );
  /*
  if (isAboveMediumScreens) {
  } else {
    //mobile
    
    return (
      <>
        {session === null ? (
          <Link
            title={t('user_profile_signIn')}
            key="signin"
            onClick={() => signIn()}
            href="#"
            className="hover:text-secondary text-white text-sm"
          >
            {t('user_profile_signIn')}
          </Link>
        ) : (
          <>
            <Link
              title={t('user_profile_myAccount')}
              key="myAccount"
              href="/account"
              className="hover:text-secondary text-white"
            >
              <div className="flex gap-1">
                <Image src={pic} alt="avatar" className="gap-2" width={25} height={25} />
                <span className="sr-only">{t('user_profile_myAccount')}</span>
              </div>
            </Link>
          </>
        )}
      </>
    );
  
  }
  */
};

export default UserProfile;
