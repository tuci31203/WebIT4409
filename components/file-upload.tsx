"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface IFileUpload {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "serverImage" | "messageFile";
}

export const FileUpload = ({ onChange, value, endpoint }: IFileUpload) => {
  const [fileType, setFileType] = useState("image")
  const handleUploadComplete = (res: any) => {
    const uploadedFile = res?.[0];
    console.log("Uploaded File Details:", {
      url: uploadedFile.url,
      fileName: uploadedFile.name,
      fileSize: uploadedFile.size,
      fileType: uploadedFile.type
    });
    setFileType(uploadedFile.type.split("/")[1]);
    onChange(uploadedFile.url);
  };

  if (value && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image fill src={value} alt="Upload" className="rounded-full" />
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (value && fileType === "pdf") {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-zinc-100 break-all" >
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
        >
          {value}
        </a>
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
          type="button"
        ><X className="h-4 w-4" /></button>
      </div>
    )
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={handleUploadComplete}
      onUploadError={(e: Error) => {
        console.log(e);
      }}
    // onClientUploadComplete={(res) => {
    //   onChange(res?.[0].url);
    //   // console.log(res)
    // }}
    // onUploadError={(e: Error) => {
    //   console.log(e);
    // }}
    />
  );
};
