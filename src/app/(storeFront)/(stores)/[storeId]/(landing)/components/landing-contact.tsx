'use client';

import React, { useRef, useState } from 'react';
import { FacebookIcon, InstagramIcon } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { Store } from 'prisma/prisma-client';

//import EarthCanvas from '@/components/canvas/Earth';
import { slideIn } from '@/lib/motion';
import { useI18n } from '@/providers/i18n-provider';
import { useTranslation } from '@/app/i18n/client';
import { Button } from '@/components/ui/button';

type LandingAboutProps = {
  storeData: Store;
};
export const LandingContact = ({ storeData }: LandingAboutProps) => {
  const formRef = useRef(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);

  const { lng } = useI18n();
  const { t } = useTranslation(lng, 'landing');

  const handleChange = (e: any) => {
    const { target } = e;
    const { name, value } = target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const email_service_id = 'service_l69dues';
  const email_template_id = 'template_1d4knec';
  const email_publicKey = 'l9AmZKlWsOgwo0aGQ';
  //console.log('email_publicKey: ', email_publicKey);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        email_service_id,
        email_template_id,
        {
          from_name: form.name,
          to_name: storeData.name + t('landing_contactus'),
          from_email: form.email,
          to_email: storeData.csEmail,
          message: form.message,
        },
        email_publicKey,
      )
      .then(
        () => {
          setLoading(false);
          alert(t('landing_submitMessage'));

          setForm({
            name: '',
            email: '',
            message: '',
          });
        },
        (error) => {
          setLoading(false);
          console.error(error);

          alert('Ahh, something went wrong. Please try again.');
        },
      );
  };

  return (
    <div className="">
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="px-1 lg:px-10 w-full py-10 mx-auto relative z-0"
      >
        <span className="hash-span" id="nav_contact">
          &nbsp;
        </span>

        <div className="xl:mt-12 flex xl:flex-row flex-col-reverse gap-5 overflow-hidden">
          <motion.div
            variants={slideIn('left', 'tween', 0.2, 1)}
            className="flex-[0.75] bg-black-100 p-2 rounded-2xl"
          >
            <p className="sm:text-[18px] text-[14px] text-primary uppercase tracking-wider pb-1">
              Get in touch
            </p>
            <h3 className="text-white font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px] pt-2 pb-5">
              {t('landing_contactus')}
            </h3>

            <div className="font-semibold mb-4 content-center grid grid-cols-3 gap-4 pt-5">
              <div className="text-white hover:text-slate">
                {storeData.lineId && <LineLink url={storeData.lineId} />}
              </div>
              <div className="text-white hover:text-slate">
                {storeData.facebookUrl && <FacebookLink url={storeData.facebookUrl} />}
              </div>
              <div className="text-white hover:text-slate">
                {storeData.igUrl && <InstagramLink url={storeData.igUrl} />}
              </div>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="mt-12 flex flex-col gap-8">
              <label className="flex flex-col">
                <span className="text-white font-medium mb-4">
                  {t('landing_contactus_form_name_label')}
                </span>
                <input
                  autoComplete="on"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder={t('landing_contactus_form_name')}
                  className="bg-tertiary py-4 px-6 placeholder:text-gray-700 text-white rounded-lg outline-none border-none font-medium"
                />
              </label>
              <label className="flex flex-col">
                <span className="text-white font-medium mb-4">
                  {t('landing_contactus_form_email_label')}
                </span>
                <input
                  autoComplete="on"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={t('landing_contactus_form_email')}
                  className="bg-tertiary py-4 px-6 placeholder:text-gray-700 text-white rounded-lg outline-none border-none font-medium"
                />
              </label>
              <label className="flex flex-col">
                <span className="text-white font-medium mb-4">
                  {t('landing_contactus_form_msg_label')}
                </span>
                <textarea
                  rows={7}
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder={t('landing_contactus_form_msg')}
                  className="bg-tertiary py-4 px-6 placeholder:text-gray-700 text-white rounded-lg outline-none border-none font-medium"
                />
              </label>

              <Button type="submit" className="btn-primary">
                {loading
                  ? t('landing_contactus_form_sending')
                  : t('landing_contactus_form_sendButton')}
              </Button>
            </form>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

type Props = {
  url: string;
  color?: string;
};

const FacebookLink = ({ url, color }: Props) => (
  <a
    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
    target="_blank"
    rel="noreferrer"
  >
    <div className="flex gap-1">
      <FacebookIcon className="gap-0 w-{50}" color={color} />
      Facebook
    </div>
  </a>
);

const InstagramLink = ({ url, color }: Props) => (
  <a href={url} target="_blank" rel="noreferrer">
    <div className="flex gap-1">
      <InstagramIcon className="gap-0 w-{50}" color={color} />
      Instagram
    </div>
  </a>
);

const LineLink = ({ url, color }: Props) => (
  <a href={`https://line.me/R/ti/p/${encodeURIComponent(url)}`} target="_blank" rel="noreferrer">
    <div className="flex gap-0 content-center">
      <Image src="/icons8-line.svg" width={28} height={28} alt="LINE" />
      LINE
    </div>
  </a>
);
