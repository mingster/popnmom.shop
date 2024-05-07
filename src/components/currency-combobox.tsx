'use client';

import useSWR from 'swr';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
//import { Currency } from '@prisma/client';
import { useI18n } from '@/providers/i18n-provider';
import { useTranslation } from '@/app/i18n/client';

export type Currency = {
  id: string;
  name: string;
  symbolNative: string;
};

type ComboboxProps = {
  defaultValue: string;
  onCurrencyChange?: (newValue: string) => void;
};

export const CurrencyCombobox = ({ defaultValue, onCurrencyChange }: ComboboxProps) => {
  const { lng } = useI18n();
  const { t } = useTranslation(lng);

  //export const CurrencySelectItems: React.FC = ({}) => {
  const url = '/api/stores/get-currencies';
  const fetcher = (url: RequestInfo) => fetch(url).then((res) => res.json());
  const { data, error, isLoading } = useSWR(url, fetcher);
  var currencies: Currency[] = [];
  if (!isLoading && !error) {
    currencies = data as Currency[];
  }

  const [open, setOpen] = React.useState(false);

  // combox is buggy if default value is empty....
  if (defaultValue === '' || defaultValue === null) defaultValue = 'TWD';
  //console.log('default: ' + defaultValue);

  const [selected, setSelected] = React.useState<string | null>(defaultValue);

  //console.log('defaultValue: ' + defaultValue);
  //console.log('selected: ' + JSON.stringify(selected));
  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;
  if (data && !isLoading && !error) {
    //console.log('data: ' + JSON.stringify(data));
    return (
      <>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[150px] justify-start">
              {selected ? <>{selected}</> : <>+ Currency</>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" side="right" align="start">
            <Command>
              <CommandInput placeholder={t('currency_combobox_changePlaceHolder')} />
              <CommandList>
                <CommandEmpty>{t('currency_combobox_notFound')}</CommandEmpty>
                <CommandGroup>
                  {currencies.map((currency, index) => (
                    <CommandItem
                      key={index}
                      value={currency.id.toLocaleUpperCase()}
                      onSelect={(value) => {
                        //console.log('onSelect: ' + value);
                        setSelected(value.toLocaleUpperCase());
                        //setSelected(currencies.find((o) => o.id === value)?.id || null);

                        //return value to parent component
                        onCurrencyChange?.(value);
                        setOpen(false);
                      }}
                    >
                      {currency.name} ({currency.id}) {currency.symbolNative}
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
