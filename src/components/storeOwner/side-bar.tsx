'use client';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import {
  BsPlus,
  BsSearch,
  BsEyeFill,
  BsBookmarkFill,
  BsFillArrowLeftSquareFill,
  BsPeopleFill,
  BsTerminalFill,
  BsFillArrowRightSquareFill,
} from 'react-icons/bs';

import { AiFillFire, AiFillMessage } from 'react-icons/ai';
import { IoMdArrowRoundUp } from 'react-icons/io';
import { MdNightlightRound, MdFeedback } from 'react-icons/md';
import { FaCog } from 'react-icons/fa';

import { motion, useAnimation } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import router from 'next/router';

const data = [
  {
    name: 'Discover',
    items: [
      {
        title: 'Popular',
        icon: AiFillFire,
      },
      {
        title: 'Most Upvoted',
        icon: IoMdArrowRoundUp,
      },
      {
        title: 'Best Discussions',
        icon: AiFillMessage,
      },
      {
        title: 'Search',
        icon: BsSearch,
      },
    ],
  },
  {
    name: 'Manage',
    items: [
      {
        title: 'Bookmarks',
        icon: BsBookmarkFill,
      },
      {
        title: 'Reading history',
        icon: BsEyeFill,
      },
      {
        title: 'Focus Mode',
        icon: MdNightlightRound,
      },
      {
        title: 'Customize',
        icon: FaCog,
      },
    ],
  },
];

const datafooter = [
  {
    name: '',
    items: [
      {
        title: 'Docs',
        href: '#',
        icon: BsBookmarkFill,
      },
      {
        title: 'Changelog',
        href: '#',

        icon: BsTerminalFill,
      },
      {
        title: 'Feedback',
        href: '#',
        icon: MdFeedback,
      },
      {
        title: 'My Account',
        href: '/account',
        icon: BsPeopleFill,
      },
    ],
  },
];

interface props {}

const Sidebar: React.FC<props> = ({}) => {
  const params = useParams();
  //const router = useRouter();

  const [active, setActive] = useState(false);
  const controls = useAnimation();
  const controlText = useAnimation();
  const controlTitleText = useAnimation();

  const showMore = useCallback(() => {
    controls.start({
      width: '250px',
      transition: { duration: 0.001 },
    });
    controlText.start({
      opacity: 1,
      display: 'block',
      transition: { delay: 0.3 },
    });
    controlTitleText.start({
      opacity: 1,
      transition: { delay: 0.3 },
    });

    setActive(true);
  }, [controlText, controlTitleText, controls]); // Add an empty array as the second argument

  const showLess = () => {
    controls.start({
      width: '55px',
      transition: { duration: 0.001 },
    });

    controlText.start({
      opacity: 0,
      display: 'none',
    });

    controlTitleText.start({
      opacity: 0,
    });

    setActive(false);
  };

  useEffect(() => {
    showMore();
  }, [showMore]);

  const adminPath = '/storeOwner';

  const pathname = usePathname();

  const nav = [
    {
      name: 'Overview',
      icon: BsBookmarkFill,
      items: [
        {
          href: `${adminPath}/${params.storeId}`,
          title: 'Overview',
          active: pathname === `${adminPath}/${params.storeId}`,
          description: '',
        },
      ],
    },
    {
      name: 'Offering',
      icon: FaCog,
      items: [
        {
          href: `${adminPath}/${params.storeId}/products`,
          title: 'Products',
          description: '',
        },
        {
          href: `${adminPath}/${params.storeId}/crossSell`,
          title: 'Cross Sell',
          description: '',
        },
        {
          href: `${adminPath}/${params.storeId}/tierSell`,
          title: 'Tier Sell / Group sell',
          description: '',
        },
        {
          href: `${adminPath}/${params.storeId}/productReview`,
          title: 'Product reviews and approval',
          description: 'manage customer reviews.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <motion.div
        animate={controls}
        className="max-w-[250px] animate duration-300 border-r border-gray-700 relative flex flex-col py-10 min-h-screen group"
      >
        {active && (
          <BsFillArrowLeftSquareFill
            onClick={showLess}
            className="absolute hidden text-2xl text-white cursor-pointer -right-4 top-10 group-hover:block "
          />
        )}
        {!active && (
          <BsFillArrowRightSquareFill
            onClick={showMore}
            className="absolute text-2xl text-white cursor-pointer -right-4 top-10"
          />
        )}
        {/*
        <div className="grow">
          {nav.map((group, index) => (
            <div key={index} className="my-1">
              <motion.p animate={controlTitleText} className="flex items-center mb-2 ml-4 text-lg">
                <group.icon className="" />
                <div className="pl-2 text-sm font-bold text-gray-500">{group.name}</div>
              </motion.p>
              {group.items.map((item, index2) => (
                <div key={index2} className="flex px-4 py-1 cursor-pointer">
                  <motion.p animate={controlText} className="ml-4 text-sm font-bold text-gray-400">
                    <a href={item.href}>{item.title}</a>
                  </motion.p>
                </div>
              ))}
            </div>
          ))}
        </div>
 */}
        <div>
          {datafooter.map((group, index) => (
            <div key={index} className="my-2">
              <motion.div
                animate={controlTitleText}
                className="mb-2 ml-4 text-sm font-bold text-gray-500"
              >
                {group.name}
              </motion.div>

              {group.items.map((item, index2) => (
                <div
                  key={index2}
                  className="flex px-4 py-1 cursor-pointer"
                  //onClick={() => router.push(item.href)}
                >
                  <item.icon className="text-lg text-gray-500" />
                  <motion.div
                    animate={controlText}
                    className="ml-4 text-sm font-bold text-gray-400"
                  >
                    {item.title}
                  </motion.div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Sidebar;
