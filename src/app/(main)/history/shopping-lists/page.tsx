/*
Developer: Mathias Holst Seeger
Date: 08-10-2024
Description:
*/

import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { format } from 'date-fns'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingList } from '@/types'

export const metadata: Metadata = {
    title: 'Shopping List History | MealHub',
    description: 'View your past shopping lists',
}

async function getShoppingListHistory(): Promise<ShoppingList[]> {
    // In a real application, this would fetch data from an API
    return [
        { id: '1', name: 'Weekly Groceries', itemCount: 15, createdAt: '2023-05-01T00:00:00Z' },
        { id: '2', name: 'Party Supplies', itemCount: 8, createdAt: '2023-04-15T00:00:00Z' },
        { id: '3', name: 'Camping Trip', itemCount: 20, createdAt: '2023-03-20T00:00:00Z' },
        { id: '4', name: 'Monthly Stock-up', itemCount: 30, createdAt: '2023-02-28T00:00:00Z' },
        { id: '5', name: 'BBQ Essentials', itemCount: 12, createdAt: '2023-01-15T00:00:00Z' },
    ]
}

export default async function ShoppingListHistoryPage() {
    const shoppingLists = await getShoppingListHistory()

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-3xl font-bold mb-6">Shopping List History</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {shoppingLists.map((list) => (
                    <Card key={list.id}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5" />
                                {list.name}
                            </CardTitle>
                            <CardDescription>
                                Created on {format(new Date(list.createdAt), 'MMMM d, yyyy')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                {list.itemCount} items
                            </p>
                            <Link href={`/history/shopping-lists/${list.id}`} passHref>
                                <Button variant="outline" className="w-full">
                                    View Details
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}