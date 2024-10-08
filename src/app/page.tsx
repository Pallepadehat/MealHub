import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
      <h1 className="text-4xl font-bold mb-6">Welcome to MealHub</h1>
      <p className="text-xl mb-8">Your personal meal planning assistant</p>
      <div className="space-x-4">
        <Button asChild>
          <Link href="/auth/login">Login</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/auth/signup">Sign Up</Link>
        </Button>
      </div>
    </div>
  )
}
