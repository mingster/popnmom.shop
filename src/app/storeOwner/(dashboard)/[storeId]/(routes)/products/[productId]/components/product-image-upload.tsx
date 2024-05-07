import React, { useState, useRef } from 'react';
import { BoxSelect } from 'lucide-react';
import Image from 'next/image';
import { uploadImage, deleteImage } from '@/lib/utils';
import { z } from 'zod';
import axios from 'axios';
import { toast } from 'react-hot-toast';

//import { ProductImage } from '@prisma/client';
import { XCircleIcon } from 'lucide-react';
import { useForm, UseFormProps, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

//render a image upload box
const MAX_COUNT = 5;

const validationSchema = z.object({
  productImages: z
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
});
type ProductImage = z.infer<typeof validationSchema>['productImages'][number];

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

interface uploadProp {
  initData: ProductImage[];
  folderName: string;
  onChange?: (newUrls: string[], publicIds: string[]) => void;
}

export const ProductImageUpload = ({ initData, folderName, onChange }: uploadProp) => {
  const params = useParams();
  const router = useRouter();

  const {
    handleSubmit,
    register,
    control,
    formState: { isValid, errors, isValidating, isDirty },
    reset,
  } = useZodForm({
    schema: validationSchema,
    defaultValues: { productImages: initData },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    name: 'productImages',
    control,
  });
  const isSubmittable = !!isDirty && !!isValid;

  //console.log('fields: ' + JSON.stringify(fields));

  const [isDropZone, setIsDropZone] = useState(false);
  const [fileLimit, setFileLimit] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [urls, setUrls] = useState<string[]>([]);
  const [publicIds, setPublicIds] = useState<string[]>([]);
  const uploadInputRef = useRef<HTMLInputElement>(null); //See Supporting Documentation #2

  /* #region drag & drop */
  //install https://marketplace.visualstudio.com/items?itemName=maptz.regionfolder to get region folding to work
  //

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDropZone(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDropZone(false);
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.dropEffect = 'copy';
    setIsDropZone(true);
    e.preventDefault();
    e.stopPropagation();
  };

  //when user drag and drop files
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      //1. check file.name for acepted file types....

      //2. check file dimensions....

      //accept the file
      const chosenFiles = Array.prototype.slice.call(e.dataTransfer.files) as File[];
      handleUploadFiles(chosenFiles);
    }
    e.dataTransfer.clearData();
    setIsDropZone(false);
    e.preventDefault();
    e.stopPropagation();
  };

  /* #endregion */

  //when user click 'Choose Image'
  const handleFileEvent = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setisLoading(true);
    e.preventDefault();
    e.stopPropagation();

    if (e.target.files && e.target.files.length > 0) {
      const chosenFiles = Array.prototype.slice.call(e.target.files) as File[];
      handleUploadFiles(chosenFiles);
    }

    setisLoading(false);
  };

  // check limit and do upload
  const handleUploadFiles = async (files: File[]) => {
    let limitExceeded = false;

    const uploaded = [...uploadedFiles];
    files.some((file) => {
      if (uploaded.findIndex((f) => f.name === file.name) === -1) {
        uploaded.push(file);
        if (uploaded.length === MAX_COUNT) setFileLimit(true);
        if (uploaded.length > MAX_COUNT) {
          alert(`You can only add a maximum of ${MAX_COUNT} files`);
          setFileLimit(false);
          limitExceeded = true;
        }
      }
    });

    //console.log(uploadedFiles);

    if (!limitExceeded) {
      //set the files to state
      setUploadedFiles(uploaded);

      //return value to parent component
      //onChange?.(uploaded);

      /*
      //do upload to cloudary
      let urls: string[] = [];
      let publicIds: string[] = [];

      uploaded.map(async (file, index) => {
        const res = await uploadImage(folderName, file);

        console.log(index + ' ' + res.secure_url + ' ' + res.public_id);
        urls.push(res.secure_url);
        publicIds.push(res.public_id);
      });

      //return value to parent component
      onChange?.(urls, publicIds);
      */
    }
    setisLoading(false);
    //return true;
  };

  const doUpload = async () => {
    //do upload to cloudary
    uploadedFiles.map(async (file, index) => {
      //1. upload to cloud storage
      const res = await uploadImage(folderName, file, 450, 380);
      setUrls((current) => [...current, res.secure_url]);
      setPublicIds((current) => [...current, res.public_id]);
      console.log(index + ' ' + res.secure_url + ' ' + res.public_id);

      //2. create db record
      const obj: ProductImage = {
        id: '',
        productId: params.productId + '',
        url: res.secure_url,
        publicId: res.public_id,
        name: '',
        description: '',
        shownInLandingPage: false,
      };

      await insertDb(obj);

      //update UI dataset
      append(obj);
    });

    //console.log(urls);
    //console.log(publicIds);
  };

  const insertDb = async (data: any) => {
    //insert to databsae
    //
    await axios.patch(`/api/${params.storeId}/products/${params.productId}/image-create`, data);
  };

  //user click upload button
  const handleCreateNew = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setisLoading(true);

    await doUpload();

    setTimeout(() => {
      //reset input once upload is completed
      if (uploadInputRef.current) {
        uploadInputRef.current.value = '';
      }
      setUploadedFiles([]);

      //return value back to parent component
      onChange?.(urls, publicIds);

      e.stopPropagation();
      setisLoading(false);

      toast.success('Image(s) uploaded');
    }, 0);
  };

  const handleDelete = async (index: number) => {
    var rowToRemove = fields[index];
    //console.log('rowToRemove: ' + JSON.stringify(rowToRemove));
    //console.log('rowToRemove: ' + rowToRemove.publicId);

    //1. remove from cloud storage
    deleteImage(fields[index].publicId);

    //2. remove from database
    const urlToDelete = `/api/${params.storeId}/products/${params.productId}/images/remove`;
    //console.log('urlToDelete: ' + urlToDelete);
    await axios.delete(urlToDelete, { data: rowToRemove });

    router.refresh();

    //remove from client data
    remove(index);
  };

  //user click Save Changes button
  const updateDb = async (data: any) => {
    //console.log('updateDb: ' + JSON.stringify(data));
    await axios.patch(`/api/${params.storeId}/products/${params.productId}/images`, data);
    /*
    //router.push(`./${params.productId}/`);
    console.log(JSON.stringify(initData));
    */
    router.refresh();
  };

  const overlayStyles = `p-5 absolute z-0 flex
    h-[380px] w-[450px] flex-col items-center justify-center
    whitespace-normal text-center text-white
    opacity-0 transition duration-500 hover:opacity-90`;

  if (isLoading) {
    return <div>loading...</div>;
  } else {
    return (
      <>
        <div className="grid grid-cols-2 gap-1 w-[500px]">
          <div
            onDrop={(e) => handleDrop(e)}
            onDragOver={(e) => handleDragOver(e)}
            onDragEnter={(e) => handleDragEnter(e)}
            onDragLeave={(e) => handleDragLeave(e)}
            className="border rounded-lg flex-1 max-w-xs w-[240px] h-[240px] overflow-hidden cursor-pointer"
          >
            {isDropZone && (
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/40 rounded-md border-dashed border-4 scale-[1.01] z-10"></div>
            )}
            <div className="flex flex-col items-center gap-1 h-[180px] justify-center py-1">
              <BoxSelect className="h-10 w-10" />
              <p className="text-sm font-medium my-0">Drag and Drop</p>
            </div>
            <div className="flex flex-col items-center justify-center h-[40px]">
              <label htmlFor="post_image">
                <div className="mt-4 text-white bg-blue-700 cursor-pointer rounded-lg py-2.5 px-7 text-sm font-medium leading-5">
                  Choose Image
                </div>
              </label>
              <input
                ref={uploadInputRef}
                type="file"
                multiple
                disabled={fileLimit}
                accept="image/*"
                onChange={(e) => {
                  //console.log(e.target.files);
                  handleFileEvent(e);
                }}
                className="hidden"
                id="post_image"
              />
            </div>
          </div>

          {uploadedFiles.length > 0 && (
            <>
              <div className="border rounded-lg flex-1 max-w-xs w-[240px] h-[240px] overflow-hidden">
                <div className="flex flex-col items-center gap-1 h-[180px] justify-center py-1 text-xs font-mono">
                  <label htmlFor="fileUpload">
                    <a className={`btn btn-primary ${!fileLimit ? '' : 'disabled'} `}>
                      Upload Files
                    </a>
                  </label>
                  <div className="uploaded-files-list">
                    {uploadedFiles.map((file, index) => (
                      <div key={index}>{file.name}</div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center h-[40px]">
                  <button
                    className="mt-4 text-white bg-blue-700 cursor-pointer rounded-lg py-2.5 px-7 text-sm font-medium leading-5"
                    onClick={handleCreateNew}
                  >
                    Upload
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/*edit product image*/}
        <div className="w-full overflow-x-auto overflow-y-hidden">
          <ul className="w-full whitespace-nowrap">
            {fields.map((pic, index) => {
              const errorForFieldName = errors?.productImages?.[index]?.name;
              const errorForFieldDescr = errors?.productImages?.[index]?.description;

              return (
                <li key={index} className="relative mr-2 inline-block">
                  <div className={overlayStyles}>
                    <p className="mt-5">{pic.description}</p>
                  </div>
                  <div className="relative w-[450px] h-[380px] overflow-hidden">
                    <div className="z-10 absolute top-2 right-1 cursor-pointer">
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={() => handleDelete(index)}
                      >
                        <XCircleIcon className=" text-red-700" />
                      </Button>
                    </div>
                    <Image
                      className={'object-cover h-[380px] w-[450px]'}
                      src={pic.url}
                      alt=""
                      priority={false}
                      width={450}
                      height={380}
                    />
                  </div>
                  <Input
                    {...register(`productImages.${index}.name` as const)}
                    placeholder="Enter the name of image"
                    defaultValue={pic.name}
                    type="text"
                    className=""
                  />
                  <div className="text-red-500 text-xs">
                    {errorForFieldName?.message ?? <>&nbsp;</>}
                  </div>
                  <Input
                    {...register(`productImages.${index}.description` as const)}
                    placeholder="Enter description of image"
                    defaultValue={pic.description}
                    type="text"
                    className=""
                  />
                  <div className="text-red-500 text-xs">
                    {errorForFieldDescr?.message ?? <>&nbsp;</>}
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      {...register(`productImages.${index}.shownInLandingPage` as const)}
                      type="checkbox"
                      onChange={() => {
                        pic.shownInLandingPage == !pic.shownInLandingPage;
                      }}
                    />
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      shown in product page
                    </label>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <Button
          disabled={isLoading}
          type="button"
          onClick={handleSubmit((data) => {
            //console.log('Data submitted:', JSON.stringify(data));
            setisLoading(true);
            updateDb(data);
            /*
             * Reset the default values to our new data.
             * This is done to "set" the validation to the newly
             * updated values.
             * See: https://react-hook-form.com/api/useform/reset
             */
            reset(data);

            setTimeout(() => {
              setisLoading(false);
              toast.success('Image(s) updated');
            }, 0);

            //toast.success('Image(s) updated');
          })}
        >
          Save changes
        </Button>
      </>
    );
  }
};
