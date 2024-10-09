/*
Developer: Patrick Jakobsen
Date: 08-10-2024
Description: Mobile Navbar, to make the ui work better on mobile.
*/

"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Utensils, ShoppingCart, Calendar, Settings } from 'lucide-react'

const navItems = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Meals', href: '/dashboard/meals', icon: Utensils },
  { name: 'Shopping', href: '/dashboard/shopping-lists', icon: ShoppingCart },
  { name: 'Planner', href: '/dashboard/meal-planner', icon: Calendar },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function MobileNavbar() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-2 px-3 text-sm ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <item.icon className="h-6 w-6 mb-1" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
