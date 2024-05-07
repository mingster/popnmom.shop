'use client';

import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Trash } from 'lucide-react';
import { Prisma, Category, ProductImage, Product, ProductAttribute } from '@prisma/client';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { AlertModal } from '@/components/modals/alert-modal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

import { ProductStatusCombobox } from './product-status-combobox';
import { ProductImageUpload } from './product-image-upload';
import { ProductPricesEdit } from './product-price-edit';
import { ProductAttributeEdit, productAttributeModel } from './product-attribute';

const formSchema = z.object({
  name: z.string().min(1),
  categoryId: z.string().min(1),
  status: z.coerce.number(),
  isFeatured: z.boolean().default(false).optional(),
  images: z
    .object({
      id: z.string(),
      productId: z.string(),
      url: z.string(),
      publicId: z.string(),
      name: z.string().optional().default(''),
      description: z.string().optional().default(''),
      shownInLandingPage: z.boolean(),
    })
    .array(),
  productPrices: z
    .object({
      id: z.string(),
      currencyId: z.string(),
      productId: z.string(),
      price: z.coerce.number().min(1),
      oldPrice: z.coerce.number().min(1).optional(),
      isDefault: z.boolean(),
    })
    .array(),
  productAttribute: productAttributeModel.optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData:
    | (Product & {
        //images: ProductImage[];
        //productPrices: ProductPrice[];
        //productAttribute: ProductAttribute;
      })
    | null;
  categories: Category[];
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, categories }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadFileUrls, setuploadFileUrls] = useState<string[]>([]);
  const [uploadFilePublicIds, setUploadFilePublicIds] = useState<string[]>([]);

  const title = initialData ? 'Edit product' : 'Create product';
  const description = initialData ? 'Edit a product.' : 'Add a new product';
  const toastMessage = initialData ? 'Product updated.' : 'Product created.';
  const action = initialData ? '儲存' : '新增';
  //const action2 = initialData ? '儲存後繼續' : '新增';

  //console.log('defaultValues: ' + JSON.stringify(defaultValues));

  //if (!initialData?.productImages)

  const defaultValues = initialData
    ? {
        ...initialData,
        categories,
      }
    : {
        name: '',
        images: [],
        productPrices: [],
        productAttribute: {
          stock: 0,
          description: '',
          displayStockAvailability: true,
          displayStockQuantity: true,
        },
        status: 0,
        isFeatured: false,
      };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onChange',
  });

  let isSubmittable;
  if (params.productId === 'new') isSubmittable = true;
  else isSubmittable = form.formState.isDirty && form.formState.isValid;

  //console.log('isDirty: ' + JSON.stringify(form.formState.isDirty));
  if (!form.formState.isValid && process.env.NODE_ENV == 'development') {
    console.log('isValid: ' + JSON.stringify(form.formState.isValid));
    console.log('err: ' + JSON.stringify(form.formState.errors));
    console.log('isSubmittable: ' + isSubmittable);
  }

  const onSubmit = async (data: ProductFormValues) => {
    try {
      /*
      if (form.formState.errors) {
        toast.error(JSON.stringify(form.formState.errors));
        return;
      }
*/
      setLoading(true);
      //console.log('data: ' + JSON.stringify(data));

      if (initialData) {
        //do update
        await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data);
        router.refresh();
      } else {
        //do create
        await axios.post(`/api/${params.storeId}/products`, data);
        router.refresh();
        router.push(`/${params.storeId}/products`);
      }
      toast.success(toastMessage);
    } catch (error: any) {
      console.error(error);
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      router.push(`/${params.storeId}/products`);
      toast.success('Product deleted.');
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
          <div className="grid grid-flow-row-dense grid-cols-4 gap-3">
            <div className="grid-flow-col">
              <h1 className="text-xl">基本資訊</h1>
            </div>

            <div className="col-span-3">
              <div className="md:grid md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>商品名稱</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="Product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>類別</FormLabel>
                      <Select
                        disabled={loading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              defaultValue={field.value}
                              placeholder="Select a category"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <div>
                          <ProductStatusCombobox
                            defaultValue={field.value}
                            //onProductStatusChange={setSelectedStatus}
                            onChange={field.onChange}
                          />
                        </div>
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Status</FormLabel>
                        <FormDescription>
                          Only Published status will appear in the store.
                        </FormDescription>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          // @ts-ignore
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Featured</FormLabel>
                        <FormDescription>This product will appear on the home page</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <FormField
            control={form.control}
            name="productAttribute"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ProductAttributeEdit initData={field.value} />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="grid grid-flow-row-dense grid-cols-8 gap-8">
            <Button
              disabled={!isSubmittable}
              className="ml-auto w-full col-span-7 mt-5 disabled:opacity-25"
              type="submit"
            >
              {action}
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.push('./')}
              className="ml-auto mt-5 justify-self-start"
            >
              完成
            </Button>
          </div>

          {initialData && (
            <>
              {/* list prices and mod dialog */}

              <div className="grid grid-flow-row-dense grid-cols-4 gap-3">
                <div className="grid-flow-col">
                  <h1 className="text-xl">價格</h1>
                </div>
                <div className="col-span-3">
                  <FormField
                    control={form.control}
                    name="productPrices"
                    render={({ field }) => (
                      <>
                        <FormItem>
                          <ProductPricesEdit
                            initData={field.value.map((pp, index) => ({
                              key: index,
                              id: pp.id,
                              currencyId: pp.currencyId,
                              productId: pp.productId,
                              price: Number(pp.price),
                              oldPrice: Number(pp.oldPrice),
                              isDefault: pp.isDefault,
                            }))}
                          />
                          <FormMessage />

                          <FormControl></FormControl>
                        </FormItem>
                      </>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-flow-row-dense grid-cols-4 gap-3">
                <div className="grid-flow-col">
                  <h1 className="text-xl">商品圖片</h1>
                  <div className="text-xs">
                    <ul>
                      <li>大小：最大 30MB，像素不可超過 1280*1280px</li>
                      <li>影片長度 : 10秒-60秒</li>
                      <li>格式：MP4 （不支援 vp9 影像編碼格式）</li>
                      <li>
                        請注意：商品影片狀態為處理中時仍可上架商品，商品影片將在處理完成後顯示於商品頁
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="col-span-3">
                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ProductImageUpload
                            initData={field.value.map((image, index) => ({
                              key: index,
                              id: image.id,
                              productId: image.productId,
                              url: image.url,
                              publicId: image.publicId,
                              name: image.name,
                              description: image.description,
                              shownInLandingPage: image.shownInLandingPage,
                            }))}
                            folderName="product"
                            onChange={(newUrls, publicIds) => {
                              setuploadFileUrls(newUrls);
                              setUploadFilePublicIds(publicIds);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </>
          )}
        </form>
      </Form>
    </>
  );
};
