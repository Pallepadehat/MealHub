/*
Developer: Patrick Jakobsen
Date: 08-10-2024
Description: Dashboard widgets, to show some quick information to the user.
*/



import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Utensils, ShoppingCart, Plus } from "lucide-react"

export function RecentMealsWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Meals</CardTitle>
        <CardDescription>Your recently added meals</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <li className="flex items-center">
            <Utensils className="mr-2 h-4 w-4" />
            <span>Spaghetti Bolognese</span>
          </li>
          <li className="flex items-center">
            <Utensils className="mr-2 h-4 w-4" />
            <span>Chicken Stir Fry</span>
          </li>
          <li className="flex items-center">
            <Utensils className="mr-2 h-4 w-4" />
            <span>Vegetable Curry</span>
          </li>
        </ul>
        <Button className="w-full mt-4">View All Meals</Button>
      </CardContent>
    </Card>
  )
}

export function CurrentShoppingListWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Shopping List</CardTitle>
        <CardDescription>Items you need to buy</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <li className="flex items-center">
            <ShoppingCart className="mr-2 h-4 w-4" />
            <span>Tomatoes (500g)</span>
          </li>
          <li className="flex items-center">
            <ShoppingCart className="mr-2 h-4 w-4" />
            <span>Chicken Breast (1kg)</span>
          </li>
          <li className="flex items-center">
            <ShoppingCart className="mr-2 h-4 w-4" />
            <span>Onions (3)</span>
          </li>
        </ul>
        <Button className="w-full mt-4">View Full List</Button>
      </CardContent>
    </Card>
  )
}

export function QuickAddWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Add</CardTitle>
        <CardDescription>Quickly add new items</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-2">
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add New Meal
        </Button>
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add New Ingredient
        </Button>
      </CardContent>
    </Card>
  )
}
