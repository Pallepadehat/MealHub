/*
Developer: Patrick Jakobsen
Date: 08-10-2024
Description: Dashboard sidebar, to complete the layout of the dashboard page.
*/

"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Home, Utensils, ShoppingCart, Calendar, Settings, LogOut, ChefHat } from 'lucide-react'
import { useAuth } from "@/hooks/useAuth"

const sidebarItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Meals', href: '/dashboard/meals', icon: Utensils },
  { name: 'Shopping Lists', href: '/dashboard/shopping-lists', icon: ShoppingCart },
  { name: 'Meal Planner', href: '/dashboard/meal-planner', icon: Calendar },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <div className={cn("flex flex-col h-screen bg-background border-r border-border", className)}>
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <ChefHat className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">MealHub</h1>
        </div>
      </div>
      <ScrollArea className="flex-1 px-3">
        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <Button
              key={item.href}
              asChild
              variant={pathname === item.href ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-5 w-5" />
                {item.name}
              </Link>
            </Button>
          ))}
        </nav>
      </ScrollArea>
      <Separator className="my-4" />
      <div className="p-6 pt-0">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg font-semibold text-primary">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <p className="font-medium">{user?.name || 'User'}</p>
            <p className="text-sm text-muted-foreground">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
        <Button variant="outline" className="w-full" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  )
}
