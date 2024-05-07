'use client';

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

import { ProductStatuses, ProductStatusT } from '@/lib/enum';
type ComboboxProps = {
  defaultValue: number;
  onChange?: (newStatus: number) => void;
};

export const ProductStatusCombobox = ({ defaultValue, onChange }: ComboboxProps) => {
  //export const ProductStatusCombobox: React.FC<ComboboxProps> = ({ defaultValue, onProductStatusChange }) => {
  const [open, setOpen] = React.useState(false);

  const [selectedStatus, setSelectedStatus] = React.useState<ProductStatusT | null>(
    //default to 'defaultValue'
    ProductStatuses.find((o) => o.value === defaultValue) || null,
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start">
          {selectedStatus ? <>{selectedStatus.label}</> : <>+ Set status</>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" side="right" align="start">
        <Command>
          <CommandInput placeholder="Change status..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {ProductStatuses.map((status, index) => (
                <CommandItem
                  key={index}
                  value={String(status.value)}
                  onSelect={(value) => {
                    setSelectedStatus(
                      ProductStatuses.find((o) => o.value === Number(value)) || null,
                    );

                    //return value to parent component
                    onChange?.(Number(value));

                    setOpen(false);
                  }}
                >
                  {status.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
