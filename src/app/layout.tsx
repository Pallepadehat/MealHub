import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthWrapper } from "@/components/layout/authWrapper";



export const metadata: Metadata = {
  title: "MealHub - A meal planning app",
  description: "MealHub is a meal planning app that helps you plan your meals for the week.",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthWrapper>
          {children}
        </AuthWrapper>
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  )
}
