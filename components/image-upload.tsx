"use client";
import { UploadDropzone } from "@/lib/uploadThing";
import { FC } from "react";
import "@uploadthing/react/styles.css";
import Image from "next/image";
import { X } from "lucide-react";

type props = {
  onChange: (url?: string) => void;
  endPoint: "billboardImage" | "productImages";
  value: string;
};
export const ImageUpload: FC<props> = ({ onChange, endPoint, value }) => {
  const handleDelete = async (value: string) => {
    onChange("");
  };

  if (value) {
    return (
      <div className="relative h-64">
        <Image src={value} alt="" fill />;
        <button
          onClick={() => handleDelete(value)}
          className="absolute rounded-full top-0 right-0 z-20 bg-rose-500 shadow-sm text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }
  return (
    <UploadDropzone
      endpoint={endPoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url!);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  );
};
