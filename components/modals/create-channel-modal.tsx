'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ChannelType } from '@prisma/client'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import qs from 'query-string'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useModal } from '@/hooks/use-modal-store'

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Channel name is required.'
    })
    .refine(name => name !== 'general', {
      message: "Channel name cannot be 'general'"
    }),
  type: z.nativeEnum(ChannelType)
})

export const CreateChannelModal = () => {
  const router = useRouter()
  const params = useParams()
  const { isOpen, onClose, type, data } = useModal()

  const isModalOpen = isOpen && type === 'createChannel'
  const { channelType } = data

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: channelType || ChannelType.TEXT
    }
  })

  useEffect(() => {
    if (channelType) {
      form.setValue('type', channelType)
    } else {
      form.setValue('type', ChannelType.TEXT)
    }
  }, [channelType, form])

  const isLoading = form.formState.isSubmitting
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: '/api/channels',
        query: {
          serverId: params?.serverId
        }
      })
      await axios.post(url, values)
      form.reset()
      router.refresh()
      onClose()
    } catch (e) {
      console.log(e)
    }
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className='overflow-hidden bg-white p-0 text-black'>
        <DialogHeader className='px-6 pt-8'>
          <DialogTitle className='text-center text-2xl font-bold'>Create Channel</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-8 px-6'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70'>
                      Channel name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className='border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0'
                        placeholder='Enter channel name'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='text-red-600' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel type</FormLabel>
                    <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className='border-0 bg-zinc-300/50 capitalize text-black outline-none ring-offset-0 focus:ring-0 focus:ring-offset-0'>
                          <SelectValue placeholder='Select a channel type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ChannelType).map(type => (
                          <SelectItem key={type} value={type} className='capitalize'>
                            {type.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className='bg-gray-100 px-6 py-4'>
              <Button disabled={isLoading}>Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
