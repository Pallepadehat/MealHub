/*
Developer: Mathias Holst Seeger
Date: 08-10-2024
Description:
*/

import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ShoppingListItems from '@/components/shopping-lists/ShoppingListItems'
import { Button } from "@/components/ui/button"
import { ShoppingList, ShoppingListItem } from '@/types'

export const metadata: Metadata = {
    title: 'Shopping List Details | MealHub',
    description: 'View and manage your shopping list items',
}

interface ShoppingListPageProps {
    params: { id: string }
}

async function getShoppingList(id: string): Promise<ShoppingList | null> {
    // In a real application, this would fetch data from an API
    const lists = [
        { id: '1', name: 'Weekly Groceries', itemCount: 10, createdAt: '2023-05-01T00:00:00Z' },
        { id: '2', name: 'Party Supplies', itemCount: 5, createdAt: '2023-05-05T00:00:00Z' },
        { id: '3', name: 'Camping Trip', itemCount: 15, createdAt: '2023-05-10T00:00:00Z' },
    ]
    return lists.find(list => list.id === id) || null
}

async function getShoppingListItems(id: string): Promise<ShoppingListItem[]> {
    // In a real application, this would fetch data from an API
    return [
        { id: '1', name: 'Milk', completed: false },
        { id: '2', name: 'Bread', completed: true },
        { id: '3', name: 'Eggs', completed: false },
    ]
}

export default async function ShoppingListPage({ params }: ShoppingListPageProps) {
    const shoppingList = await getShoppingList(params.id)

    if (!shoppingList) {
        notFound()
    }

    const items = await getShoppingListItems(params.id)

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{shoppingList.name}</h1>
                <Button variant="outline">Share List</Button>
            </div>
            <ShoppingListItems
                items={items}
                onItemToggle={(id, checked) => {
                    console.log('Toggle item', id, checked)
                    // In a real app, this would update the item in the database
                }}
                onItemDelete={(id) => {
                    console.log('Delete item', id)
                    // In a real app, this would delete the item from the database
                }}
                onItemAdd={(name) => {
                    console.log('Add item', name)
                    // In a real app, this would add the item to the database
                }}
            />
        </div>
    )
}