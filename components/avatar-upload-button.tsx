'use client'
import { Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { changeProfileAction } from '@/actions/user.action'
import { Button } from '@/components/ui/button'
import useCurrentUser from '@/hooks/use-current-user'
import { UploadButton } from '@/lib/uploadthing'

interface CustomUploadButtonProps {
  endpoint: 'serverImage' | 'messageFile'
}

export default function AvatarUploadButton({ endpoint }: CustomUploadButtonProps) {
  const { update } = useCurrentUser()
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  const handleUploadComplete = async (res: any) => {
    const uploadedFile = res?.[0]
    if (uploadedFile?.url) {
      setIsUploading(true)
      try {
        const result = await changeProfileAction({ image: uploadedFile.url })
        await update({ image: uploadedFile.url })
        if (!result?.success) {
          toast.error(result?.message)
          return
        }

        toast.success(result?.message)
        router.refresh()
      } catch (error) {
        console.error(error)
        toast.error('Failed to update profile image')
      } finally {
        setIsUploading(false)
      }
    }
  }

  return (
    <div className='relative inline-block'>
      <UploadButton
        endpoint={endpoint}
        onClientUploadComplete={handleUploadComplete}
        onUploadError={(error: Error) => {
          toast.error(`Upload failed: ${error.message}`)
        }}
        appearance={{
          button: '!w-[90px] !h-8',
          container: 'absolute opacity-0 cursor-pointer'
        }}
      />
      <Button variant='outline' size='sm' disabled={isUploading} className='flex items-center gap-2'>
        {isUploading ? (
          'Uploading...'
        ) : (
          <>
            <Upload className='h-4 w-4' />
            Upload
          </>
        )}
      </Button>
    </div>
  )
}
