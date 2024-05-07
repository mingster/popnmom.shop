
import { useState, useEffect } from 'react';
import { globalStyle } from '@/global-style';
import getStore from '@/actions/get-store';
import { Store } from '@prisma/client';

import { useI18n } from '@/providers/i18n-provider';
import { useTranslation } from '@/app/i18n/client';

export default function categoryPage() {

  return (
    <div className="py-10">
      <h1 className={globalStyle.sectionHeadText}>categoryPage</h1>
      <div className="py-10">
      </div>
    </div>
  );
}
