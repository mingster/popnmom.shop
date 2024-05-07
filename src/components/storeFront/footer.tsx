'use client';

import { ArrowBigUpDash } from 'lucide-react';
import { Store } from 'prisma/prisma-client';
import { useI18n } from '@/providers/i18n-provider';
import { useTranslation } from '@/app/i18n/client';

type prop = {
  storeData: Store;
};
export const Footer = ({ storeData }: prop) => {
  //storeData.showcsAddress = true;
  const { lng } = useI18n();
  const { t } = useTranslation(lng, 'landing');

  return (
    <footer className="text-white">
      {/* scroll up to top */}
      <div className="xs:bottom-10 bottom-32 w-full">
        <div className="flex justify-between flex-row content-end items-end py-1">
          <div className="px-1 lg:px-10 text-sm uppercase">
            <ul>
              <li>
                <a href={`/${storeData.id}/tos`}>{t('landing_tos')}</a>
              </li>
              <li>
                <a href={`/${storeData.id}/privacy`}>{t('landing_privacy')}</a>
              </li>
            </ul>
          </div>

          <div className="">
            <a href="#top" title="scroll up to top">
              <ArrowBigUpDash className="w-[35px] h-[35px]" />
            </a>
          </div>

          <div className="text-sm uppercase pr-5">
            <div>{storeData.showcsAddress && storeData.csAddress}</div>
            <div>{storeData.showcsPhoneNumber && storeData.csPhoneNumber}</div>
            <div>{storeData.showcsEmail && storeData.csEmail}</div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
