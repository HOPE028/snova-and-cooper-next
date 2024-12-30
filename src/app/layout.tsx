import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Providers } from './provider'
import Footer from '@/components/Footer'
import { AuthProvider } from '@/contexts/AuthContext'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'Snova & Cooper',
  description: 'A little place for our little family',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-rose-950 antialiased`}
      >
        <div className='bg-rose-950'>
          <Providers>
            <AuthProvider>{children}</AuthProvider>
          </Providers>
          <Footer />
        </div>
      </body>
    </html>
  )
}
