import * as React from 'react';
import useSWR, { Fetcher } from 'swr';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { toast } from '@/hooks/use-toast';
import { Country } from 'prisma/prisma-client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandList,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useI18n } from '@/providers/i18n-provider';
import { useTranslation } from '@/app/i18n/client';

type ComboboxProps = {
  defaultValue: string | undefined;
  onCountryChange?: (newValue: string) => void;
};

export const CountryCombobox = ({ defaultValue, onCountryChange }: ComboboxProps) => {
  const { lng } = useI18n();
  const { t } = useTranslation(lng);

  const url = `${process.env.NEXT_PUBLIC_API_URL}/stores/get-countries`;
  //const url = '/api/stores/get-countries';
  const fetcher = (url: RequestInfo) => fetch(url).then((res) => res.json());
  const { data, error, isLoading } = useSWR(url, fetcher);

  let countries: Country[] = [];
  if (!isLoading && !error) countries = data;

  const [open, setOpen] = React.useState(false);

  const [selected, setSelected] = React.useState<string | undefined>(
    defaultValue,
    //countries.find((c) => (c.alpha3 = defaultValue))?.alpha3 || null
  );

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;
  if (data && !isLoading && !error) {
    if (!selected) setSelected(defaultValue);

    //console.log('selected: ' + selected);
    /*
    if (open) {
      setSelected(defaultValue);
    }
    */
    return (
      <>
        {/*
        <div className="flex pr-10">{selected}</div> */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[200px] justify-start">
              {selected ? <>{selected}</> : <>+ Country</>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0 no-wrap">
            <Command className="rounded-lg border shadow-md">
              <CommandInput placeholder={t('country_combobox_PlaceHolder')} className="h-9" />
              <CommandList>
                <CommandEmpty>{t('country_combobox_noCountryFound')}</CommandEmpty>
                <CommandGroup>
                  {countries.map((obj, index) => (
                    <CommandItem
                      key={index}
                      value={obj.alpha3}
                      onSelect={(value) => {
                        //console.log('onSelect: ' + value);
                        setSelected(value);
                        //setSelected(currencies.find((o) => o.id === value)?.id || null);

                        //return value to parent component
                        onCountryChange?.(value);
                        setOpen(false);
                      }}
                    >
                      {obj.name} ({obj.alpha3})
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 w-4',
                          selected === obj.alpha3 ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </>
    );
  }
};
