/*
Developer: Mathias Holst Seeger
Date: 08-10-2024
Description: Shopping Lists page
*/

import React from 'react'
import { Metadata } from 'next'
import ShoppingListOverview from '@/components/shopping-lists/ShoppingListOverview'
import { Button } from "@/components/ui/button"
import { ShoppingList } from '@/types'

export const metadata: Metadata = {
    title: 'Shopping Lists | MealHub',
    description: 'View and manage your shopping lists',
}

async function getShoppingLists(): Promise<ShoppingList[]> {
    // In a real application, this would fetch data from an API
    return [
        { id: '1', name: 'Weekly Groceries', itemCount: 10, createdAt: '2023-05-01T00:00:00Z' },
        { id: '2', name: 'Party Supplies', itemCount: 5, createdAt: '2023-05-05T00:00:00Z' },
        { id: '3', name: 'Camping Trip', itemCount: 15, createdAt: '2023-05-10T00:00:00Z' },
    ]
}

export default async function ShoppingListsPage() {
    const shoppingLists = await getShoppingLists()

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Shopping Lists</h1>
                <Button>Create New List</Button>
            </div>
            <ShoppingListOverview shoppingLists={shoppingLists} />
        </div>
    )
}