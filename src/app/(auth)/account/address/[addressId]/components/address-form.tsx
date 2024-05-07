'use client';

import * as z from 'zod';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { corsHeaders } from '@/lib/api_helper';

//import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  //FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { AlertModal } from '@/components/modals/alert-modal';
import { Address } from 'prisma/prisma-client';

import { useTwZipCode2, cities, districts } from '@/lib/useTwZipCode2/index';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { CountryCombobox } from '@/components/country-combobox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const formSchema = z.object({
  //id: z.string(),
  //userId: z.string(),
  firstName: z.string().min(1, 'first name'),
  lastName: z.string().min(1, 'last name'),
  company: z.string().optional().nullish(),
  streetLine1: z.string().min(1, 'street name'),
  streetLine2: z.string().optional().nullish(),
  city: z.string(),
  district: z.string().optional(),
  province: z.string().optional(),
  postalCode: z.string().optional(),
  countryId: z.string(),
  phoneNumber: z.string().min(1, 'phone number'),
  type: z.string().optional(),
  reference: z.string().optional().nullish(),
  isDefault: z.boolean().default(false),
  //createdAt: z.date(),
  //updatedAt: z.date(),
});
type formValues = z.infer<typeof formSchema>;
interface formProps {
  userId: string;
  initialData:
    | (Address & {
        //images: ProductImage[];
        //productPrices: ProductPrice[];
      })
    | null;
}

export const AddressForm: React.FC<formProps> = ({ userId, initialData }) => {
  const params = useParams();
  const router = useRouter();
  const { city, district, zipCode, handleCityChange, handleDistrictChange } = useTwZipCode2();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [onload, setOnload] = useState(true);

  const title = initialData ? '編輯住址' : '新增住址';
  const description = initialData ? '編輯住址' : '新增住址';
  const toastMessage = initialData ? '住址已儲存' : '住址已新增';
  const action = initialData ? '完成' : '新增';

  const defaultValues = initialData
    ? {
        //edit
        ...initialData,
        district: initialData.district ?? undefined,
        province: initialData.province ?? undefined,
        postalCode: initialData.postalCode ?? undefined,
        type: initialData.type ?? undefined,
      }
    : {
        //new
        firstName: '',
        lastName: '',
        streetLine1: '',
        streetLine2: '',
        city: '',
        district: '',
        province: '',
        postalCode: '',
        countryId: 'TWN',
        phoneNumber: '',
        type: '',
        reference: '',
        isDefault: true,
      };

  useEffect(() => {
    if (onload && defaultValues.city && defaultValues.district) {
      handleCityChange(defaultValues.city, defaultValues.district);
      //handleDistrictChange(defaultValues.district);
      setOnload(false);
    }
  }, [onload, defaultValues.district, defaultValues.city, handleCityChange]);

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onChange',
  });

  const isSubmittable = !!form.formState.isDirty && !!form.formState.isValid;

  const onSubmit = async (data: formValues) => {
    try {
      setLoading(true);
      //console.log('data: ' + JSON.stringify(data));
      data.city = city;
      data.district = district;
      data.postalCode = zipCode;

      if (initialData) {
        //console.log('do update');

        //do update
        const url = `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}/address/${initialData.id}`;
        await axios.post(url, data);
      } else {
        //do create
        const url = `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}/address`;
        await axios.post(url, data);
      }

      toast.success(toastMessage);

      //router.refresh();
      router.push(`/account/?tab=address`);
    } catch (error: any) {
      toast.error('Something went wrong.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      const url = `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}/address/${initialData?.id}`;

      await axios.delete(url);
      router.refresh();
      router.push(`/account/?tab=address`);
      toast.success('Address deleted.');
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />

      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button disabled={loading} variant="destructive" size="sm" onClick={() => setOpen(true)}>
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="md:grid md:grid-cols-3 gap-1">
            <Controller
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox defaultChecked={defaultValues.isDefault} {...field} />}
                      label="設為預設地址"
                    />
                  </FormGroup>
                </>
              )}
            />

            <Controller
              control={form.control}
              name="type"
              render={({ field }) => (
                <>
                  <ToggleButtonGroup
                    exclusive
                    aria-label="Label as"
                    {...field}
                    onChange={field.onChange}
                  >
                    <ToggleButton value="HOME" aria-label="HOME">
                      住家
                    </ToggleButton>
                    <ToggleButton value="WORK" aria-label="WORK">
                      公司
                    </ToggleButton>
                    <ToggleButton value="PICKUP" aria-label="PICKUP">
                      其他領貨地點
                    </ToggleButton>
                  </ToggleButtonGroup>
                </>
              )}
            />
          </div>

          <div className="md:grid md:grid-cols-5 gap-1">
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <>
                  <FormControl variant="outlined">
                    <TextField
                      label="姓氏"
                      disabled={loading}
                      variant="outlined"
                      className="mr-2 mb-2"
                      inputRef={field.ref}
                      {...field}
                    />
                  </FormControl>
                </>
              )}
            />
            <Controller
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <>
                  <FormControl variant="outlined">
                    <TextField
                      label="名字"
                      disabled={loading}
                      variant="outlined"
                      className="mr-2 mb-2"
                      inputRef={field.ref}
                      {...field}
                    />
                  </FormControl>
                </>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <>
                  <FormControl variant="outlined">
                    <TextField
                      label="電話號碼"
                      disabled={loading}
                      variant="outlined"
                      className="mr-2 mb-2"
                      inputRef={field.ref}
                      {...field}
                    />
                  </FormControl>
                </>
              )}
            />
          </div>

          <div className="md:grid md:grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="streetLine1"
              render={({ field }) => (
                <>
                  <FormControl variant="outlined">
                    <TextField
                      label="街道、巷弄，門牌號碼"
                      disabled={loading}
                      variant="outlined"
                      className="mr-2 mb-2"
                      inputRef={field.ref}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </>
              )}
            />
            <FormField
              control={form.control}
              name="streetLine2"
              render={({ field }) => (
                <>
                  <FormControl variant="outlined">
                    <TextField
                      label="大樓名稱 等其他資訊"
                      disabled={loading}
                      variant="outlined"
                      className="mr-2 mb-2"
                      inputRef={field.ref}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </>
              )}
            />
          </div>
          <div className="md:grid md:grid-cols-3 gap-2">
            <FormField
              control={form.control}
              name="countryId"
              render={({ field }) => (
                <CountryCombobox defaultValue={field.value} onCountryChange={field.onChange} />
              )}
            />
          </div>

          <div className="md:grid md:grid-cols-3 gap-2">
            <FormControl variant="outlined">
              <InputLabel id="city">縣市</InputLabel>
              <Select
                labelId="city"
                id="city"
                autoWidth={true}
                className="mr-2 mb-2"
                //defaultValue={initialData?.city}
                value={city}
                onChange={(event) => handleCityChange(event.target.value as string)}
                label="縣市"
              >
                {cities.map((city, i) => {
                  return (
                    <MenuItem value={city} key={i}>
                      {city}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl variant="outlined">
              <InputLabel id="district">行政區</InputLabel>
              <Select
                labelId="district"
                id="district"
                autoWidth={true}
                className="mr-2 mb-2"
                //defaultValue={defaultValues.district}
                value={district}
                onChange={(e) => handleDistrictChange(e.target.value as string)}
                label="行政區"
              >
                {districts[city].map((district, i) => {
                  return (
                    <MenuItem value={district} key={i}>
                      {district}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl variant="outlined">
              <TextField
                id="zipCode"
                label="郵遞區號 Read Only"
                //defaultValue={zipCode}
                value={zipCode}
                disabled={true}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
              />
            </FormControl>
          </div>

          <div className="grid grid-flow-row-dense grid-cols-8 gap-8">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/account/?tab=address')}
              className="ml-auto w-full mt-5 justify-self-start"
            >
              取消
            </Button>
            <Button
              disabled={!isSubmittable}
              className="ml-auto w-full col-span-7 mt-5 disabled:opacity-25"
              type="submit"
            >
              {action}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
