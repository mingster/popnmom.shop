'use client';

import TypewriterComponent from 'typewriter-effect';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Store } from 'prisma/prisma-client';

import HtmlButton from '@/components/ui/html-button';
import { globalStyle } from '@/global-style';
import { useI18n } from '@/providers/i18n-provider';
import { useTranslation } from '@/app/i18n/client';

type prop = {
  storeData: Store;
};

//relative aspect-video  bg-clip-border bg-contain bg-repeat-x
//<div className="relative min-h-screen bg-[url('/theBoard.jpg') bg-cover opacity-90 pb-1">

export const LandingHero = ({ storeData }: prop) => {
  const { lng } = useI18n();
  const { t } = useTranslation(lng, 'landing');

  return (
    <div className="relative w-screen">
      <div className="min-h-screen opacity-90 bg-cover bg-no-repeat bg-center bg-[url('/theBoard.jpg')] pb-1">
        <span className="hash-span" id="hero">
          &nbsp;
        </span>

        <div
          className={`absolute inset-0 top-[220px] max-w-7xl mx-auto ${globalStyle.paddingX} flex flex-row items-start gap-5`}
        >
          <div className="flex flex-col justify-center items-center mt-5">
            <div className="w-5 h-5 rounded-full bg-[#915EFF]" />
            {/* render a dot */}
            <div className="w-1 sm:h-80 h-40 violet-gradient" />
            {/* render a gradient stripe */}
          </div>

          <div>
            <h1 className="font-black text-[#ffcc00] lg:text-[80px] sm:text-[60px] xs:text-[50px] text-[40px] lg:leading-[98px] mt-2">
              {t('landing_hero_title')}
              <span className="text-[#915EFF]"></span>
            </h1>

            <div className={`${globalStyle.heroSubText} mt-2 text-black-100`}>
              {/* tagline animation */}
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                <TypewriterComponent
                  options={{
                    strings: ['樂高', '上帝與樂高..', '上帝玩樂高...', ' = LEGOD....'],
                    autoStart: true,
                    loop: true,
                  }}
                />
              </div>
            </div>

            <div className="font-bold py-36 space-y-5">
              <div className="text-sm md:text-xl font-light text-white">
                {t('landing_hero_txt1')}
              </div>
              <div>
                <Link href={`${storeData.id}/legod/bigcross/`}>
                  <HtmlButton className="md:text-lg p-4 md:p-6 font-semibold bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500">
                    {t('landing_hero_large')}
                  </HtmlButton>
                </Link>

                <Link href={`${storeData.id}/legod/smcross/`}>
                  <HtmlButton className="md:text-lg p-4 md:p-6 font-semibold bg-gradient-to-r from-purple-400 to-pink-600 hover:from-green-400 hover:to-blue-500">
                    {t('landing_hero_small')}
                  </HtmlButton>
                </Link>
              </div>
              <div className="text-white text-xs md:text-sm font-normal">
                {t('landing_hero_txt2')}{' '}
              </div>

              <div className="h-auto absolute inset-0 z-[-1]"></div>
            </div>
          </div>
        </div>

        {/* scroll down to about */}
        <div className="absolute bottom-10 w-full flex justify-center items-center">
          <a href="#product" title="scroll down to product section">
            <div className="w-[35px] h-[64px] rounded-3xl border-4 border-white flex justify-center items-start p-2">
              <motion.div
                animate={{
                  y: [0, 24, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
                className="w-3 h-3 rounded-full bg-white mb-1 border-white"
              />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};
