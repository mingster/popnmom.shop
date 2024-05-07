import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import crypto from 'crypto';
import axios from 'axios';
import Resizer from 'react-image-file-resizer';

export const generateSHA1 = (data: any) => {
  const hash = crypto.createHash('sha1');
  hash.update(data);
  return hash.digest('hex');
};

export const generateSignature = (publicId: string, apiSecret: string) => {
  const timestamp = new Date().getTime();
  return `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
};

/*
export const getPublicIdFromUrl = (url: string) => {
  const regex = /\/v\d+\/([^/]+)\.\w{3,4}$/;
  const match = url.match(regex);
  return match ? match[1] : null;
};
*/

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

//https://articles.wesionary.team/image-optimization-in-react-during-upload-5ca351d943d1
const resizeFile = (file: File, resizeToWidth?: number, resizeToHeight?: number) =>
  new Promise((resolve) => {
    let quality = 100;
    //4MB image file
    if (file.size > 4000000) {
      quality = 90;
    }
    //8MB image file
    if (file.size > 8000000) {
      quality = 85;
    }

    if (resizeToWidth && resizeToHeight)
      Resizer.imageFileResizer(
        file,
        resizeToWidth,
        resizeToHeight,
        'JPEG',
        quality,
        0,
        (uri) => {
          resolve(uri);
        },
        //'blob'
        'base64',
      );
  });

//upload image to cloudinary
//BUG: resizeToWidth & resizeToHeight must be specified -- otherwise upload won't happen...
export const uploadImage = async (
  folderName: string,
  image: File,
  resizeToWidth?: number,
  resizeToHeight?: number,
) => {
  var YOUR_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string;
  var YOUR_UNSIGNED_UPLOAD_PRESET = process.env
    .NEXT_PUBLIC_CLOUDINARY_UNSIGNED_UPLOAD_PRESET as string;

  const resizedImage = (await resizeFile(image, resizeToWidth, resizeToHeight)) as File;

  const formData = new FormData();
  formData.append('file', resizedImage);
  formData.append('upload_preset', YOUR_UNSIGNED_UPLOAD_PRESET);
  formData.append('folder', folderName);

  try {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${YOUR_CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    //upload_response: https://cloudinary.com/documentation/upload_images#upload_response
    return res.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

//call cloudinary to delete the image
// https://cloudinary.com/documentation/image_upload_api_reference#destroy
//https://www.obytes.com/blog/cloudinary-in-nextjs
export const deleteImage = async (publicId: string) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string;
  const timestamp = new Date().getTime();
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_APIKEY as string;
  const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_APISECRET as string;
  const signature = generateSHA1(generateSignature(publicId, apiSecret));
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;

  try {
    const response = await axios.post(url, {
      public_id: publicId,
      signature: signature,
      api_key: apiKey,
      timestamp: timestamp,
    });

    //console.log('handleDeleteImage: ' + JSON.stringify(response));
  } catch (error) {
    console.error(error);
  }
};

/*
const checkImageWidth = async (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event: any) => {
      const image = new Image();
      image.src = event.target.result;
      image.onload = () => {
        resolve(image.width);
        return image.width;
      };
      reader.onerror = (err) => reject(err);
    };
  });
};
*/

export function getAbsoluteUrl() {
  const origin =
    typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';

  return origin;
}

export function getHostname() {
  const origin =
    typeof window !== 'undefined' && window.location.hostname ? window.location.hostname : '';

  return origin;
}

export function isIOS() {
  return (
    ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(
      navigator.platform,
    ) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  );
}
