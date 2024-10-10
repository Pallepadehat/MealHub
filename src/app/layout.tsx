import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/components/auth/AuthContext'
// import Footer from '@/components/layout/Footer'
import './globals.css'
import { Toaster } from 'react-hot-toast'

// Load the Inter font with Latin subset
const inter = Inter({ subsets: ['latin'] })

// Define metadata for the application
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
        {/* Wrap the entire application with AuthProvider for authentication context */}
        <AuthProvider>
          <main className="">
            {/* Render the child components */}
            {children}
            {/* Add Toaster component for displaying toast notifications */}
            <Toaster />
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}

/*
Developer: Patrick Jakobsen
Date: 10-10-2024
*/
