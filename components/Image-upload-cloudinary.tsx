"use client";

import { ImageIcon, X } from "lucide-react";
import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "./ui/button";
type props = {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
};

const CloudinaryImageUpload: FC<props> = ({
  onChange,
  onRemove,
  value,
  disabled,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!isMounted) {
    return null;
  }
  return (
    <div>
      <div className="flex gap-5">
        {value.map((url, i, arr) => (
          <div
            key={url}
            className="relative border-2 border-black/25 shadow-sm hover:shadow-md mb-10 transition-all duration-200 w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="absolute z-10  top-0 right-0 bg-red-500 w-5 h-5 flex items-center justify-center rounded-full text-white">
              <button onClick={() => onRemove(url)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <Image src={url} fill alt="" className="object-cover rounded-md" />
          </div>
        ))}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset="vznqihmj">
        {({ open }) => {
          const handleClick = (e: React.MouseEvent) => {
            e.preventDefault();
            open();
          };
          return (
            <Button
              disabled={disabled}
              onClick={handleClick}
              className="bg-lime-600 hover:bg-lime-700 text-white"
            >
              Upload Image
              <ImageIcon className="w-4 h-4 ml-2" />
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default CloudinaryImageUpload;
