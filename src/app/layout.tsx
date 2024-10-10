import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/components/auth/AuthContext'
// import Footer from '@/components/layout/Footer'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MealHub',
  description: 'Your personal meal planning assistant',
}

// Root layout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <AuthProvider>
          <main className="">
            {children}
            <Toaster />
          </main>
         {/*  <Footer /> */}
        </AuthProvider>
      </body>
    </html>
  )
}

/*
Developer: Patrick Jakobsen
Date: 10-10-2024
*/
