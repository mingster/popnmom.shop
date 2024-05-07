import { useState } from 'react';
import { z } from 'zod';
import { useForm, UseFormProps, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';

export const productAttributeModel = z.object({
  stock: z.coerce.number().default(0),
  description: z.string().optional(),
  displayStockAvailability: z.boolean(),
  displayStockQuantity: z.boolean(),

  /*
  sku: z.string().optional(),
  gtin: z.string().optional(),
  mfgPartNumber: z.string().optional(),
  isRecurring: z.boolean(),
  cycleLen: z.coerce.number().positive().optional(),
  cyclePeriod: z.coerce.number().positive().optional(),
  tytalCycles: z.coerce.number().positive().optional(),
  isBrandNew: z.boolean().optional(),
  isShipRequired: z.boolean().optional(),
  isFreeShipping: z.boolean().optional(),
  additionalShipCost: z.coerce.number().positive().optional(),
  allowBackOrder: z.boolean(),
  orderMinQuantity: z.coerce.number().optional(),
  orderMaxQuantity: z.coerce.number().optional(),
  disableBuyButton: z.boolean(),
  weight: z.coerce.number().min(1),
  height: z.coerce.number().min(1),
  width: z.coerce.number().min(1),
  availableStartDate: z.date().nullish(),
  availableEndDate: z.date().nullish(),
  */
});

const validationSchema = z.object({
  productAttribute: productAttributeModel,
});

type ProductAttribute = z.infer<typeof validationSchema>['productAttribute'];

function useZodForm<TSchema extends z.ZodType>(
  props: Omit<UseFormProps<TSchema['_input']>, 'resolver'> & {
    schema: TSchema;
  },
) {
  const form = useForm<TSchema['_input']>({
    ...props,
    resolver: zodResolver(props.schema, undefined, {
      // This makes it so we can use `.transform()`s on the schema without same transform getting applied again when it reaches the server
      //rawValues: true
    }),
  });

  return form;
}

interface productAttrProps {
  initData?: ProductAttribute;
}

export const ProductAttributeEdit: React.FC<productAttrProps> = ({ initData }) => {
  //const params = useParams();
  //const router = useRouter();

  const defaultValues = initData
    ? {
        ...initData,
      }
    : {
        stock: 0,
        description: '',
        sku: '',
        gtin: '',
        mfgPartNumber: '',
        isRecurring: false,
        cycleLen: 0,
        cyclePeriod: 0,
        tytalCycles: 0,
        isBrandNew: true,
        isShipRequired: true,
        isFreeShipping: false,
        additionalShipCost: 0,
        displayStockAvailability: true,
        displayStockQuantity: true,
        allowBackOrder: true,
        orderMinQuantity: 1,
        orderMaxQuantity: 10,
        disableBuyButton: false,
        weight: 0,
        height: 0,
        width: 0,
        availableStartDate: new Date(),
        availableEndDate: new Date(),
      };

  const { register, getValues, watch, setValue } = useFormContext(); // retrieve all hook methods
  const {
    //handleSubmit,
    //register,
    control,
    formState: { isValid, errors, isValidating, isDirty },
    //reset,
  } = useZodForm({
    schema: validationSchema,
    defaultValues: { productAttribute: defaultValues },
    mode: 'onChange',
  });

  const isSubmittable = !!isDirty && !!isValid;

  const onchangeDisplayStockAvailability = () => {
    //const field = getValues('productAttribute.displayStockAvailability') as boolean;
    const field = watch('productAttribute.displayStockAvailability') as boolean;
    setValue('productAttribute.displayStockAvailability', !field);

    //defaultValues.displayStockAvailability = !defaultValues.displayStockAvailability;
    const values = getValues();
    //console.log(JSON.stringify(values));
  };

  const onchangeDisplayStockQuantity = () => {
    const field = watch('productAttribute.displayStockQuantity') as boolean;
    setValue('productAttribute.displayStockQuantity', !field);
  };

  return (
    <>
      {/* edit */}

      <Collapsible>
        <CollapsibleTrigger className="flex">
          <h1 className="text-xl">屬性</h1>
          <ArrowLeft className="ml-2" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="grid grid-flow-row-dense grid-cols-4 gap-3">
            <div className="grid-flow-col"></div>

            <div className="col-span-3">
              <FormItem>
                <FormLabel>商品描述</FormLabel>
                <FormControl>
                  <Textarea
                    {...register(`productAttribute.description` as const)}
                    placeholder="商品描述"
                    defaultValue={defaultValues.description}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              {/*<!-- #region stock--> */}
              <div className="md:grid md:grid-cols-3 gap-8 mt-3">
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <div className="whitespace-nowrap">
                    <FormLabel>庫存</FormLabel>
                    <FormDescription></FormDescription>
                  </div>

                  <FormControl>
                    <Input
                      {...register(`productAttribute.stock` as const)}
                      aria-invalid={errors.productAttribute?.stock ? 'true' : 'false'}
                      placeholder="0"
                      defaultValue={defaultValues.stock}
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      {...register(`productAttribute.displayStockAvailability` as const)}
                      checked={defaultValues.displayStockAvailability}
                      onCheckedChange={onchangeDisplayStockAvailability}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>是否顯示庫存？</FormLabel>
                    <FormDescription></FormDescription>
                  </div>
                </FormItem>

                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      {...register(`productAttribute.displayStockQuantity` as const)}
                      checked={defaultValues.displayStockQuantity}
                      onCheckedChange={onchangeDisplayStockQuantity}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>是否顯示庫存數量？</FormLabel>
                    <FormDescription></FormDescription>
                  </div>
                </FormItem>
              </div>
              {/* #endregion */}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
};
