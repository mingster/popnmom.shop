'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

import { slideIn, staggerContainer, fadeIn, textVariant } from '@/lib/motion';
import YoutubeIframePlayer from '@/components/video/YoutubeIframePlayer';
import { Store, Prisma } from 'prisma/prisma-client';
const withObj = Prisma.validator<Prisma.ProductReviewDefaultArgs>()({
  include: {
    customer: true,
  },
});
type ProductReview = Prisma.ProductReviewGetPayload<typeof withObj>;

type LandingAboutProps = {
  storeData: Store;
  reviews: ProductReview[];
};
import { useI18n } from '@/providers/i18n-provider';
import { useTranslation } from '@/app/i18n/client';

export const LandingAbout = ({ storeData, reviews }: LandingAboutProps) => {
  //console.log('aboutUs: ' + storeData.aboutUs);
  //console.log('aboutUsVideoUrl: ' + storeData.aboutUsVideoUrl);
  const { lng } = useI18n();
  const { t } = useTranslation(lng, 'landing');

  return (
    <div className="h-screen">
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="px-1 lg:px-10 w-full py-10"
      >
        <span className="hash-span" id="nav_about">
          &nbsp;
        </span>

        <div className="w-full mx-auto xl:flex-row xl:mt-12 flex-col-reverse gap-10 overflow-hidden">
          <motion.div
            //variants={slideIn("left", "tween", 0.2, 1)}
            className="flex-[0.75] bg-black-100 p-2 rounded-2xl"
          >
            <p className="sm:text-[18px] text-[14px] text-primary uppercase tracking-wider pb-1">
              About us
            </p>
            <h3 className="text-white font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px] pt-2 pb-5">
              {t('landing_aboutus')}
            </h3>

            {storeData.aboutUs && (
              <div
                className="text-white text-lg"
                dangerouslySetInnerHTML={{ __html: storeData.aboutUs }}
              />
            )}

            <div className="mx-auto py-10">
              {storeData.aboutUsVideoUrl && (
                <YoutubeIframePlayer videoId={storeData.aboutUsVideoUrl} />
              )}
            </div>

            {/* testimonials */}
            {reviews && (
              <>
                <motion.div variants={textVariant(0)}>
                  <p className="sm:text-[18px] text-[14px] text-primary uppercase tracking-wider pb-1">
                    What others say
                  </p>
                  <h3 className="text-white font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px] pt-2 pb-5">
                    {t('landing_testimonial')}
                  </h3>
                </motion.div>

                <div className="bg-tertiary rounded-2xl sm:px-1 px-6 sm:py-1 py-1 min-h-[300px] w-full">
                  <div className="mt-2 pb-2 sm:px-1 px-16 flex flex-wrap gap-5 justify-center">
                    {reviews.map((review, index) => (
                      <FeedbackCard key={index} index={index} review={review} />
                    ))}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

interface FeedbackCardProps {
  index: number;
  review: ProductReview;
}
const FeedbackCard = ({ index, review }: FeedbackCardProps) => {
  return (
    <>
      <motion.div
        variants={fadeIn('', 'spring', index * 0.5, 0.75)}
        className="bg-black p-10 rounded-3xl w-[420px]"
      >
        <p className="text-white font-black text-[48px]">&quot;</p>

        <div className="mt-1">
          <p className="text-white tracking-wider text-[18px]">{review.reviewText}</p>

          <div className="mt-7 flex justify-between items-center gap-1">
            <div className="flex-1 flex flex-col">
              <p className="text-white font-medium text-[16px]">
                <span className="blue-text-gradient">@</span> {review.customer.name}
              </p>
              <p className="mt-1 text-secondary text-[12px]"></p>
            </div>

            <Image
              src={String(review.customer.image)}
              alt={`feedback_by-${review.customer.name}`}
              width={10}
              height={10}
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
        </div>
      </motion.div>
    </>
  );
};
