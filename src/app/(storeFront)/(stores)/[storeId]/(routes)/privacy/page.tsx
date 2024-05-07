import * as fs from 'fs';
import path from 'path';

import { remark } from 'remark';
import html from 'remark-html';
import { Store } from '@prisma/client';

import { globalStyle } from '@/global-style';
import prismadb from '@/lib/prismadb';

import { useI18n } from '@/providers/i18n-provider';
import { useTranslation } from '@/app/i18n/index';

const PrivacyPage = async ({ params }: { params: { storeId: string } }) => {
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
    },
  });

  let contentHtml = '';
  if (!store?.privacyPolicy) {
    // read default privacy markdown
    //
    const filePath = process.cwd() + '/public/privacy.md';
    //const thePath = path.resolve(__dirname, '/privacy.md');
    //console.log(thePath);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    //console.log(fileContents);

    // Use remark to convert markdown into HTML string
    const processedContent = await remark().use(html).process(fileContents);
    contentHtml = processedContent.toString();
    //console.log(contentHtml);
  } else {
    contentHtml = '<pre>' + store.privacyPolicy + '</pre>';
  }

  const lng = 'tw';
  const { t } = await useTranslation(lng, 'landing');

  return (
    <div className="py-10">
      <h1 className={globalStyle.sectionHeadText}>{t('landing_privacy')}</h1>
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </div>
  );
};

export default PrivacyPage;
