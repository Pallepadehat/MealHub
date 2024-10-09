/*
Developer: Patrick Jakobsen
Date: 08-10-2024
Description: The complete dashboard page.
*/

import { RecentMealsWidget, CurrentShoppingListWidget, QuickAddWidget } from "@/components/dashboard/DashboardWidgets"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <RecentMealsWidget />
        <CurrentShoppingListWidget />
        <QuickAddWidget />
      </div>
    </div>
  )
}
