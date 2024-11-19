import './globals.css'

import type { Metadata } from 'next'
import localFont from 'next/font/local'

import AuthProvider from '@/components/providers/auth-provider'
import { ModalProvider } from '@/components/providers/modal-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900'
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900'
})

export const metadata: Metadata = {
  title: 'Discode',
  description: 'Group 5 - WebIT4409'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <html lang='en' suppressHydrationWarning>
        <body className={cn(`${geistSans.variable} ${geistMono.variable} antialiased`, 'bg-white dark:bg-[#313338]')}>
          <ThemeProvider attribute='class' defaultTheme='dark' enableSystem={false} storageKey='discord-theme'>
            <Toaster richColors position='top-right' />
            <ModalProvider />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </AuthProvider>
  )
}
