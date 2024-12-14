import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text
} from '@react-email/components'

interface EmailType {
  preview: string
  url?: string
  title?: string
  name?: string
  instruction?: string
  contentMode?: string
  buttonContent?: string
  textContent?: string
  footerNote?: string
}

export default function EmailTemplate({
  preview,
  url,
  title,
  name,
  instruction,
  contentMode,
  buttonContent,
  textContent,
  footerNote
}: EmailType) {
  return (
    <Html lang='en'>
      <Head>
        <Preview>{preview}</Preview>
      </Head>
      <Tailwind>
        <Body className='mx-auto my-auto bg-white px-2 font-sans'>
          <Container className='mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]'>
            <Img
              src='https://utfs.io/f/9q465tkU8KX6fIGtmVThjk0P8slJCp3L6rwIT7hK4Y1MmqZ5'
              alt='DisCode'
              width='60'
              height='60'
              className='mx-auto my-0 mt-[15px]'
            />
            <Section className='mt-[15px]'>
              <Text className='mt-[16px] text-center text-[18px] font-semibold leading-[28px] text-indigo-600'>
                {preview}
              </Text>
              <Heading
                as='h1'
                className='text-center text-[32px] font-semibold leading-[40px] tracking-[0.4px] text-gray-900'
              >
                {title}
              </Heading>
              {name && <Text className='mt-2 text-sm leading-[24px]'>Hi {name},</Text>}
              <Text className='mt-2 text-sm leading-[24px]'>{instruction}</Text>
              {contentMode === 'button' && (
                <Section className='my-4 text-center'>
                  <Button
                    className='rounded-xl bg-indigo-600 px-6 py-3 text-center font-semibold text-white'
                    href={url}
                  >
                    {buttonContent}
                  </Button>
                </Section>
              )}
              {contentMode === 'text' && (
                <Section className='mx-auto my-3 w-32 rounded-xl bg-gray-100 py-0'>
                  <Text className='text-center text-xl font-bold tracking-widest text-black'>{textContent}</Text>
                </Section>
              )}
              <Text className='mt-4 text-sm leading-[24px]'>{footerNote}</Text>
              <Text className='mt-4 text-sm leading-[24px]'>
                Best regards, <br />
                The DisCode Team
              </Text>
            </Section>
            <Hr />
            <Img
              src='https://utfs.io/f/9q465tkU8KX6fIGtmVThjk0P8slJCp3L6rwIT7hK4Y1MmqZ5'
              width={32}
              height={32}
              style={{
                WebkitFilter: 'grayscale(100%)',
                filter: 'grayscale(100%)',
                margin: '20px 0'
              }}
            />
            <Text className='text-[12px] text-gray-500'>
              DisCode, Inc. <br />
            </Text>
            <Text className='text-[12px] text-gray-500'>
              No. 1 Dai Co Viet, Hai Ba Trung, Hanoi <br />
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
