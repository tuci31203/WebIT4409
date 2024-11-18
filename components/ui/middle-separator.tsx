export default function MiddleSeparator({ label }: { label: string }) {
  return (
    <div className='relative'>
      <div className='absolute inset-0 flex items-center'>
        <span className='w-full border-t' />
      </div>
      <div className='relative flex justify-center text-sm'>
        <span className='bg-background px-2 text-muted-foreground'>{label}</span>
      </div>
    </div>
  )
}
