import { FileIcon, X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

import { UploadDropzone } from '@/lib/uploadthing'

interface IFileUpload {
  onChange: (url?: string) => void
  value: string
  endpoint: 'serverImage' | 'messageFile'
}

export const FileUpload = ({ onChange, value, endpoint }: IFileUpload) => {
  const [fileType, setFileType] = useState('image')
  const handleUploadComplete = (res: any) => {
    const uploadedFile = res?.[0]
    // console.log("Uploaded File Details:", {
    //   url: uploadedFile.url,
    //   fileName: uploadedFile.name,
    //   fileSize: uploadedFile.size,
    //   fileType: uploadedFile.type
    // });
    let url = uploadedFile.url
    setFileType(uploadedFile.type.split('/').pop())
    if (uploadedFile.type.split('/').pop() === 'pdf') {
      url = 'PDF' + uploadedFile.url
    }
    onChange(url)
  }

  if (value && fileType !== 'pdf') {
    return (
      <div className='relative h-20 w-20'>
        <Image fill src={value} alt='Upload' className='rounded-full' />
        <button
          onClick={() => onChange('')}
          className='absolute right-0 top-0 rounded-full bg-rose-500 p-1 text-white shadow-sm'
          type='button'
        >
          <X className='h-4 w-4' />
        </button>
      </div>
    )
  }

  if (value && fileType === 'pdf') {
    return (
      <div className='relative mt-2 flex items-center break-all rounded-md bg-zinc-100 p-2'>
        <FileIcon className='h-10 w-10 fill-indigo-200 stroke-indigo-400' />
        <a
          href={value.slice(3)}
          target='_blank'
          rel='noopener noreferrer'
          className='ml-2 text-sm text-indigo-500 hover:underline dark:text-indigo-400'
        >
          {value.slice(3)}
        </a>
        <button
          onClick={() => onChange('')}
          className='absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-white shadow-sm'
          type='button'
        >
          <X className='h-4 w-4' />
        </button>
      </div>
    )
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={handleUploadComplete}
      onUploadError={(e: Error) => {
        console.log(e)
      }}
      // onClientUploadComplete={(res) => {
      //   onChange(res?.[0].url);
      //   // console.log(res)
      // }}
      // onUploadError={(e: Error) => {
      //   console.log(e);
      // }}
    />
  )
}
