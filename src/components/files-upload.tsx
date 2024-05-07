import React, { useState } from 'react';
import { BoxSelect } from 'lucide-react';
import Image from 'next/image';
import { generateSHA1, generateSignature, uploadImage, deleteImage } from '@/lib/utils';

//render a image upload box
const MAX_COUNT = 5;

interface uploadProp {
  folderName: string;
  onChange?: (newUrls: string[], publicIds: string[]) => void;
  //onChange?: (uploadedFiles: File[]) => void;
}
export const FilesUpload = ({ folderName, onChange }: uploadProp) => {
  const [isDropZone, setIsDropZone] = useState(false);
  const [fileLimit, setFileLimit] = useState(false);
  const [isLoading, setisLoading] = React.useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [urls, setUrls] = useState<string[]>([]);
  const [publicIds, setPublicIds] = useState<string[]>([]);

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

  //when user click choose image label
  const handleFileEvent = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setisLoading(true);

    if (e.target.files && e.target.files.length > 0) {
      const chosenFiles = Array.prototype.slice.call(e.target.files) as File[];
      handleUploadFiles(chosenFiles);
    }
    e.preventDefault();
    e.stopPropagation();
  };

  // check limit and do upload
  const handleUploadFiles = (files: File[]) => {
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
  const doUpload = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setisLoading(true);

    //do upload to cloudary
    uploadedFiles.map(async (file, index) => {
      const res = await uploadImage(folderName, file);
      setUrls(current => [...current, res.secure_url]);
      setPublicIds(current => [...current, res.public_id]);

      //console.log(index + ' ' + res.secure_url + ' ' + res.public_id);
    });

    //console.log(urls);
    //console.log(publicIds);
    onChange?.(urls, publicIds);

    e.stopPropagation();
    setisLoading(false);
  };

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
                    onClick={doUpload}
                  >
                    Upload
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </>
    );
  }
};
