import React, { useState } from 'react';
import { BoxSelect } from 'lucide-react';
import Image from 'next/image';
//render a image upload box

interface ImageUploadBoxProp {
  image: File | null;
  setImage: (image: File | null) => void;
}

const ImageUploadBox: React.FC<ImageUploadBoxProp> = ({
  image,
  setImage,
}: {
  image: File | null;
  setImage: (image: File | null) => void;
}) => {
  const [isDropZone, setIsDropZone] = useState(false);

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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      var file = e.dataTransfer.files[0];
      //1. check file.name for acepted file types....

      //2. check file dimensions....

      //accept the file
      setImage(file);
    }
    e.dataTransfer.clearData();
    setIsDropZone(false);

    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      onDrop={(e) => handleDrop(e)}
      onDragOver={(e) => handleDragOver(e)}
      onDragEnter={(e) => handleDragEnter(e)}
      onDragLeave={(e) => handleDragLeave(e)}
      className="border rounded-lg flex-1 max-w-xs h-[240px] overflow-hidden"
    >
      {isDropZone && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/40 rounded-md border-dashed border-4 scale-[1.01] z-10"></div>
      )}
      {image ? (
        <div className="relative w-full rounded-md h-full">
          <Image
            className="object-cover h-full w-full rounded-md my-0"
            src={URL.createObjectURL(image)}
            width={120}
            height={40}
            alt={image.name}
          />
          {/*
          <img
            className="object-cover h-full w-full rounded-md my-0"
            src={URL.createObjectURL(image)}
            alt={image.name}
          /> */}
          <label className="absolute my-0 bottom-2 flex justify-center w-full" htmlFor="post_image">
            <div className="mt-4  text-white bg-blue-700/70 cursor-pointer rounded-lg py-2.5 px-7 text-sm font-medium leading-5">
              Change
            </div>
          </label>
          <input
            type="file"
            onChange={(e) => {
              //console.log(e.target.files);
              setImage(e.target.files && e.target.files[0]);
            }}
            className="hidden"
            id="post_image"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 h-full justify-center py-4">
          <BoxSelect className="h-10 w-10" />
          <p className="text-sm font-medium my-0">Drag and Drop</p>

          <div>
            <label htmlFor="post_image">
              <div className="mt-4 text-white bg-blue-700 cursor-pointer rounded-lg py-2.5 px-7 text-sm font-medium leading-5">
                Choose Image
              </div>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                console.log(e.target.files);
                setImage(e.target.files && e.target.files[0]);
              }}
              className="hidden"
              id="post_image"
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default ImageUploadBox;
