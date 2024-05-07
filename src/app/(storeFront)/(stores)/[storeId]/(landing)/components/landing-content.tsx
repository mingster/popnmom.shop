'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { slideIn, staggerContainer, fadeIn, textVariant } from '@/lib/motion';
import Picture from './landing_pic';
import { Store, ProductImage } from 'prisma/prisma-client';

export interface IProductImage {
  name: string;
  description?: string;
  url: string;
}

/*
const productPictures: Array<IProductImage> = [
  {
    name: '小樂高',
    description:
      '被這個獨特又有意義的禮物驚喜到！是mini版的自己！還原度好高，哪個女孩子會拒絕呢？ 限時搶購只需五千八.',
    url: '/img1.jpg',
  },
  {
    name: '大樂高',
    description:
      '讓方仔定格你的美好瞬間！上傳照片，定制屬於你的积木人偶吧. 最值得入手的定制禮物. Q版自己，還原度超高. 限時搶購只需 2百8.',
    url: '/img2.jpg',
  },
  {
    name: '大樂高',
    description: '大樂高再一張',
    url: '/img3.jpg',
  },
  {
    name: '高大尚禮盒',
    description: '讓受贈者感受您的心意',
    url: '/img4.jpg',
  },
  {
    name: '高大尚禮盒',
    description: '讓受贈者感受您的心意',
    url: '/img5.jpg',
  },
];
*/

type LandingProps = {
  pictures: ProductImage[];
};

//display product picture
export const LandingContent = ({ pictures }: LandingProps) => {
  // #region get images from backend api
  /*
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_STORE_ID}/productImage/?shownInLandingPage=true`;
  
  const fetcher = (URL: RequestInfo) => fetch(URL).then((res) => res.json());
  const { data, error, isLoading } = useSWR(URL, fetcher);

  let productPictures: IProductImage[] = [];
  if (!isLoading && !error) productPictures = data;
  console.log(JSON.stringify(data));
*/
  // #endregion

  //if (error) return <div>failed to load</div>;
  //if (isLoading) return <div>loading...</div>;
  //if (data && !isLoading && !error) {
  return (
    <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center h-screen">
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="px-1 lg:px-10 w-full py-10"
      >
        <span className="hash-span" id="nav_product">
          &nbsp;
        </span>

        <motion.div
          variants={slideIn('right', 'tween', 0.2, 1)}
          className="flex-[0.75] bg-black-100 p-2 rounded-2xl"
        >
          <p className="sm:text-[18px] text-[14px] text-primary uppercase tracking-wider pb-1">
            Products
          </p>
          <h3 className="text-white font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px] pt-2 pb-5">
            產品介紹
          </h3>
        </motion.div>

        <motion.div
          className="mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          variants={{
            hidden: { opacity: 0, x: -50 },
            visible: { opacity: 1, x: 0 },
          }}
        >
          <div className="mt-5 h-[353px] w-full overflow-x-auto overflow-y-hidden">
            <ul className="w-full whitespace-nowrap">
              {pictures.map((item, index) => (
                <Picture
                  key={`${item.name}-${index}`}
                  name={String(item.name)}
                  description={String(item.description)}
                  image={item.url}
                />
              ))}
            </ul>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
};
//};
