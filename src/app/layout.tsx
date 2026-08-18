import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import Footer from '@/components/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-neutral-50">
        {children}
        <Footer />
      </body>
    </html>
  )
}


