'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Trash, XCircleIcon } from 'lucide-react';
import { Store } from '@prisma/client';

import { cn } from '@/lib/utils';
import ImageUploadBox from '@/components/image-upload-box';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';

import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { AlertModal } from '@/components/modals/alert-modal';
import { ApiAlert } from '@/components/ui/api-alert';
import { useOrigin } from '@/hooks/admin/use-origin';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LocaleSelectItems } from '@/components/locale-select-items';
import { CountryCombobox } from '@/components/country-combobox';

import { generateSHA1, generateSignature, uploadImage, deleteImage } from '@/lib/utils';

const formSchema = z.object({
  name: z.string().min(1, { message: 'store name is required' }),
  description: z.string().optional().default(''),
  logo: z.string().optional().default(''),
  logoPublicId: z.string().default('').optional().default(''),
  aboutUs: z.string().optional().default(''),
  aboutUsVideoUrl: z.string().optional().default(''),
  privacyPolicy: z.string().optional().default(''),
  tos: z.string().optional().default(''),
  lineId: z.string().optional().default(''),
  facebookUrl: z.string().optional().default(''),
  igUrl: z.string().optional().default(''),
  showcsAddress: z.boolean().default(false),
  showcsPhoneNumber: z.boolean().default(false),
  showcsEmail: z.boolean().default(false),
  csAddress: z.string().optional().default(''),
  csPhoneNumber: z.string().optional().default(''),
  csEmail: z.string().optional().default(''),
  defaultLocale: z.string(),
  defaultCountry: z.string(),
});

type SettingsFormValues = z.infer<typeof formSchema>;

interface SettingsFormProps {
  initialData: Store;
  /*
  initialData:
    | (Store & {
        name: string;
      })
    | null;
  logo: string;
  
  */
}

export const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!initialData.description) initialData.description = '';
  if (!initialData.aboutUs) initialData.aboutUs = '';
  if (!initialData.aboutUsVideoUrl) initialData.aboutUsVideoUrl = '';
  if (!initialData.privacyPolicy) initialData.privacyPolicy = '';
  if (!initialData.tos) initialData.tos = '';
  if (!initialData.lineId) initialData.lineId = '';
  if (!initialData.facebookUrl) initialData.facebookUrl = '';
  if (!initialData.igUrl) initialData.igUrl = '';
  if (!initialData.csAddress) initialData.csAddress = '';
  if (!initialData.csPhoneNumber) initialData.csPhoneNumber = '';
  if (!initialData.csEmail) initialData.csEmail = '';

  const defaultValues = initialData
    ? {
        ...initialData,
      }
    : {};

  //console.log('defaultValues: ' + JSON.stringify(defaultValues));
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const isSubmittable = !!form.formState.isDirty && !!form.formState.isValid;

  //logo display and image upload
  const [image, setImage] = useState<File | null>(null);
  //let logo = initialData?.logo;
  //console.log('logo: ' + logo);
  const [logo, setLogo] = useState<string | null>(initialData?.logo);
  const [logoPublicId, setlogoPublicId] = useState<string | null>(initialData?.logoPublicId);

  const onSubmit = async (data: SettingsFormValues) => {
    //console.log('onSubmit: ' + JSON.stringify(data));
    //console.log('logo: ' + image?.name);

    try {
      setLoading(true);

      if (image) {
        const result = await uploadImage('logo', image, 120, 40);
        //console.log('upload result: ' + JSON.stringify(res));
        data.logoPublicId = result.public_id;
        data.logo = result.secure_url;
      }

      //empty logo if user press the logo delete button
      if (logo === null) {
        //remove from clondinary
        deleteImage(data.logoPublicId as string);

        //empty the param in database
        data.logo = '';
        data.logoPublicId = '';
      }

      //console.log('logo: ' + data.logo);
      //console.log('logoPublicId: ' + data.logoPublicId);
      //console.log('onSubmit: ' + JSON.stringify(data));

      await axios.patch(`/api/stores/${params.storeId}`, data);
      router.refresh();
      toast.success('Store updated.');
    } catch (error: any) {
      toast.error('Something went wrong.' + error.message);
    } finally {
      setLoading(false);
      //console.log(data);
    }
  };

  const deleteImageFromClient = async (public_id: string) => {
    // remove logo data from client side
    setLogo(null);
    //setlogoPublicId(null);
  };

  useEffect(() => {
    if (logo === null) {
      setImage(null);
    }
  }, [logo]);

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/stores/${params.storeId}`);
      router.refresh();
      router.push('/');
      toast.success('Store deleted.');
    } catch (error: any) {
      toast.error('Make sure you removed all products and categories first.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  if (loading) {
    return <div>loading...</div>;
  } else {
    return (
      <>
        <AlertModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onConfirm={onDelete}
          loading={loading}
        />

        <div className="flex items-center justify-between">
          <Heading title="Store settings" description="Manage store preferences" />
          <Button disabled={loading} variant="destructive" size="sm" onClick={() => setOpen(true)}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1 w-full">
            <div className="grid grid-flow-row-dense grid-cols-4 gap-3">
              <div className="grid-flow-col">
                <h1 className="text-xl">網站基本設定</h1>

                <FormDescription>敘述會顯示在google搜尋結果</FormDescription>
                <p>
                  <br />
                </p>
                <FormDescription>size should be: 120px * 40px</FormDescription>
              </div>
              <div className="col-span-3">
                <div className="flex flex-row">
                  <div className="flex-initial w-1/2 pr-2">
                    <FormField
                      control={form.control}
                      name="defaultLocale"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>預設語言</FormLabel>
                          <Select
                            disabled={loading}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a default locale" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <LocaleSelectItems />
                            </SelectContent>
                          </Select>
                          <FormDescription></FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col w-1/2">
                    <FormField
                      control={form.control}
                      name="defaultCountry"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>預設國家</FormLabel>
                          <CountryCombobox
                            defaultValue={field.value}
                            onCountryChange={field.onChange}
                          />
                          <FormDescription></FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex flex-row">
                  <div className="flex-initial  w-1/2 pr-2">
                    <FormField
                      control={form.control}
                      name="logo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Logo</FormLabel>
                          {logo && (
                            <>
                              <div className="relative w-[120px] h-[40px] overflow-hidden">
                                <div className="z-10 absolute top-2 right-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    type="button"
                                    onClick={() => deleteImageFromClient(logoPublicId as string)}
                                  >
                                    <XCircleIcon className=" text-red-700" />
                                  </Button>
                                </div>
                                <Image
                                  src={logo}
                                  alt="logo"
                                  width={120}
                                  height={40}
                                  priority={false}
                                  className="object-cover"
                                />
                              </div>
                            </>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="logoPublicId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel></FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col space-y-4">
                    <ImageUploadBox image={image ?? null} setImage={setImage ?? (() => {})} />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>名稱</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="">敘述</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            <div className="grid grid-flow-row-dense grid-cols-4 gap-8">
              <div className="grid-flow-col">
                <h1 className="text-xl">客服設定</h1>
                <div className="text-sm text-muted-foreground">
                  選擇您要啟用的客服方式。建議您多開啟幾種，方便消費者聯繫。
                </div>

                <p>
                  <br />
                </p>
                <FormDescription>LINE客服，請輸入 https:// 或 line:// 開頭的網址。</FormDescription>
                <p>
                  <br />
                </p>
                <FormDescription>臉書粉絲頁，請輸入 https:// 開頭的網址。</FormDescription>
                <p>
                  <br />
                </p>

                <FormDescription>IG粉絲頁，請輸入 https:// 開頭的網址。</FormDescription>
              </div>
              <div className="col-span-3">
                {/* social network links */}
                <FormField
                  control={form.control}
                  name="lineId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LINE 客服</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="Line Id" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="facebookUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>臉書粉絲頁</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="facebook Url" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="igUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instgram 粉絲頁</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="ig Url" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* contact info */}
                <div className="flex flex-row">
                  <div className="flex-initial pr-2">
                    <FormField
                      control={form.control}
                      name="showcsAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>客服地址</FormLabel>
                          <FormDescription></FormDescription>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex-auto">
                    <FormField
                      control={form.control}
                      name="csAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>&nbsp;</FormLabel>
                          <FormDescription></FormDescription>
                          <FormControl>
                            <Input disabled={loading} placeholder="555 Main street" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex flex-row">
                  <div className="flex-initial pr-2">
                    <FormField
                      control={form.control}
                      name="showcsPhoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>客服電話</FormLabel>
                          <FormDescription></FormDescription>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex-auto">
                    <FormField
                      control={form.control}
                      name="csPhoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>&nbsp;</FormLabel>
                          <FormDescription></FormDescription>
                          <FormControl>
                            <Input disabled={loading} placeholder="1-800-HELPME" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex flex-row">
                  <div className="flex-initial pr-2">
                    <FormField
                      control={form.control}
                      name="showcsEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>客服信箱</FormLabel>
                          <FormDescription></FormDescription>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex-auto">
                    <FormField
                      control={form.control}
                      name="csEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>&nbsp;</FormLabel>
                          <FormDescription></FormDescription>
                          <FormControl>
                            <Input
                              disabled={loading}
                              placeholder="support@mydomain.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-flow-row-dense grid-cols-4 gap-8">
              <div className="grid-flow-col">
                <h1 className="text-xl">網站內容</h1>
                <FormDescription>請貼上購物網站中『關於我們』的內容。</FormDescription>
                <p>
                  <br />
                </p>
                <FormDescription>購物網站的『關於我們』的YouTube 影片Id</FormDescription>
              </div>
              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="aboutUs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>關於我們</FormLabel>
                      <FormControl>
                        <Textarea
                          disabled={loading}
                          placeholder="About Us section in the website."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="aboutUsVideoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>YouTube 影片Id</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="CYVJgkBnSxE" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="privacyPolicy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>隱私權政策</FormLabel>
                      <FormControl>
                        <Textarea disabled={loading} placeholder="privacy policies" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>服務條款</FormLabel>
                      <FormControl>
                        <Textarea
                          disabled={loading}
                          placeholder="Term of Services content in the website."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-flow-row-dense grid-cols-8 gap-8">
              <Button
                variant="secondary"
                onClick={() => router.push('./')}
                className="ml-auto mt-5 justify-self-start"
              >
                取消
              </Button>

              <Button className="ml-auto w-full col-span-7 mt-5 disabled:opacity-25" type="submit">
                Save changes
              </Button>
            </div>
          </form>
        </Form>

        <ApiAlert
          title="NEXT_PUBLIC_API_URL"
          variant="public"
          description={`${origin}/api/${params.storeId}`}
        />
      </>
    );
  }
};
