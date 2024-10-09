'use client'

import { useAuth } from '@/components/auth/AuthContext'
import MealForm from '@/components/meals/MealForm'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UtensilsCrossed } from 'lucide-react'

export default function CreateMealPage() {
    const { user } = useAuth()

    if (!user) {
        return null // or a loading spinner
    }

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-3xl mx-auto  shadow-none border-none rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <MealForm user={user} />
        </CardContent>
      </Card>
    </div>
  )
}

/*
Developer: Patrick Jakobsen
Date: 09-10-2024
*/
