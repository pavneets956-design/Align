import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from './components/ThemeProvider'

export const metadata: Metadata = {
  title: 'ALIGN - Inner clarity · Practical action',
  description: 'Align your mind. Align your life. Inner clarity meets practical action.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr" className="light">
      <body className="antialiased bg-white dark:bg-[#0E1117] text-slate-900 dark:text-[#E4E7EB] transition-colors" dir="ltr">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}

