import useSWR, { Fetcher } from 'swr';
import { Locale } from 'prisma/prisma-client';

import { SelectItem } from '@/components/ui/select';

export const LocaleSelectItems: React.FC = ({}) => {
  const url = '/api/stores/get-locales';
  const fetcher = (url: RequestInfo) => fetch(url).then((res) => res.json());
  const { data, error, isLoading } = useSWR(url, fetcher);

  let locales: Locale[] = [];
  if (!isLoading && !error) locales = data;

  return (
    <>
      {locales.map((locale, index) => (
        <SelectItem key={index} value={locale.lng}>
          {locale.name} ({locale.id})
        </SelectItem>
      ))}
    </>
  );
};
