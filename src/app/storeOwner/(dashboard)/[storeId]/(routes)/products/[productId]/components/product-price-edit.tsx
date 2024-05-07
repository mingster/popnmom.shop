import React from 'react';
import { z } from 'zod';
import axios from 'axios';
import { useForm, UseFormProps, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Currency, PlusIcon, TrashIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CurrencyCombobox } from '@/components/currency-combobox';

const validationSchema = z.object({
  productPrices: z.array(
    z.object({
      id: z.string().optional(),
      productId: z.string().optional(),
      currencyId: z.string().min(1),
      price: z.coerce.number().min(1),
      oldPrice: z.coerce.number().min(1).optional(),
      isDefault: z.boolean().optional(),
    }),
  ),
});

type ProductPrice = z.infer<typeof validationSchema>['productPrices'][number];

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

interface productPriceProps {
  initData: ProductPrice[];
}

export const ProductPricesEdit: React.FC<productPriceProps> = ({ initData }) => {
  const params = useParams();
  const router = useRouter();
  //console.log('price: ' + JSON.stringify(initData));
  const {
    handleSubmit,
    register,
    control,
    formState: { isValid, errors, isValidating, isDirty },
    reset,
  } = useZodForm({
    schema: validationSchema,
    defaultValues: { productPrices: initData },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    name: 'productPrices',
    control,
  });

  const isSubmittable = !!isDirty && !!isValid;
  const [open, setOpen] = React.useState(false);
  const [openAddNew, setOpenAddNew] = React.useState(false);

  const [newCurrency, setNewCurrency] = React.useState('TWD');
  const [appendNewPrice, setNewPrice] = React.useState(0);
  const [appendOldPrice, setOldPrice] = React.useState(0);

  const updateDb = async (data: any) => {
    //console.log('updateDb: ' + JSON.stringify(data));
    await axios.patch(`/api/${params.storeId}/products/${params.productId}/prices`, data);
    /*
    //router.push(`./${params.productId}/`);
    console.log(JSON.stringify(initData));
    */
    router.refresh();
    setOpen(false);
  };
  const handleNewPrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    //console.log('append price: ' + event.target.value);
    setNewPrice(Number(event.target.value));
  };
  const handleOldPrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    //console.log('append price: ' + event.target.value);
    setOldPrice(Number(event.target.value));
  };
  //user click create new button
  const handleNewPriceSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    //console.log(event.target);
    //console.log(event.currentTarget);
    const newPrice = {
      productId: params.productId + '',
      currencyId: newCurrency,
      price: appendNewPrice,
      oldPrice: appendOldPrice,
      isDefault: false,
    };

    //insert to Db
    await insertDb(newPrice);

    //update data set
    append(newPrice);
    //console.log('newPrice: ' + JSON.stringify(initData));

    router.refresh();
    //close addnew dialog
    setOpenAddNew(false);
  };

  const insertDb = async (data: any) => {
    await axios.patch(`/api/${params.storeId}/products/${params.productId}/price-create`, data);
  };

  const handleDelete = async (index: number) => {
    var rowToRemove = fields[index];

    //console.log('rowToRemove: ' + JSON.stringify(rowToRemove));
    //console.log('rowToRemove: ' + rowToRemove.currencyId);

    const urlToDelete = `/api/${params.storeId}/products/${params.productId}/prices/${rowToRemove.currencyId}`;
    //console.log('urlToDelete: ' + urlToDelete);

    await axios.delete(urlToDelete);

    router.refresh();
    remove(index);
  };

  return (
    <>
      {/* create new */}
      <Dialog open={openAddNew} onOpenChange={setOpenAddNew}>
        <DialogTrigger asChild>
          <Button variant="outline">Add New Price</Button>
        </DialogTrigger>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Add New Price</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 items-center gap-1">
              <div>
                幣別：
                <Label className="text-right">
                  <CurrencyCombobox defaultValue={newCurrency} onCurrencyChange={setNewCurrency} />
                </Label>
              </div>
              <div>
                售價：
                <Input
                  placeholder="Enter the price.."
                  defaultValue={0}
                  type="number"
                  className=""
                  onChange={handleNewPrice}
                />
              </div>
              <div>
                折扣價：
                <Input
                  placeholder="Enter old price.."
                  defaultValue={0}
                  type="number"
                  className=""
                  onChange={handleOldPrice}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              /*
              onClick={handleSubmit((data) => {
                console.log('Data submitted:', data);
                insertDb(data);
                reset(data);
              })}
              */
              onClick={handleNewPriceSubmit}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* edit */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Modify Price(s)</Button>
        </DialogTrigger>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Modify Price(s)</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {fields.map((field, index) => {
              const errorForField = errors?.productPrices?.[index]?.currencyId;
              return (
                <div key={index} className="grid grid-cols-4 items-center gap-4">
                  <Button className="py-3" type="button" onClick={() => handleDelete(index)}>
                    <TrashIcon size={15} />
                  </Button>
                  <Label htmlFor="currencyId" className="text-right">
                    {field.currencyId}
                  </Label>
                  <Input
                    {...register(`productPrices.${index}.price` as const)}
                    placeholder="Enter the price.."
                    defaultValue={field.price}
                    type="number"
                    className=""
                  />
                  <Input
                    {...register(`productPrices.${index}.oldPrice` as const)}
                    placeholder="Enter old price.."
                    defaultValue={field.oldPrice}
                    type="number"
                    className=""
                  />
                  <p>{errorForField?.message ?? <>&nbsp;</>}</p>
                </div>
              );
            })}
          </div>

          <DialogFooter>
            <Button
              disabled={!isSubmittable}
              type="button"
              onClick={handleSubmit((data) => {
                //console.log('Data submitted:', data);

                updateDb(data);

                // assume you'd send the request to your backend here
                //setPrices(data.productPrices);

                /*
                 * Reset the default values to our new data.
                 * This is done to "set" the validation to the newly
                 * updated values.
                 * See: https://react-hook-form.com/api/useform/reset
                 */
                reset(data);
              })}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* display */}
      <div className="flex flex-row">
        {fields.map((item, index) => (
          <div key={index} className="basis-1/4">
            <div className="justify-self-end pr-5">
              <Label>
                {item.currencyId} ${Number(item.price)}
              </Label>
            </div>
            <div className="text-red-800 justify-self-end pr-5">
              {item.oldPrice && (
                <>
                  <del>${Number(item.oldPrice)}</del>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
