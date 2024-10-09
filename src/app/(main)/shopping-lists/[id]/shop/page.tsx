/*
Developer: Mathias Holst Seeger
Date: 08-10-2024
Description:
*/

'use client'

import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import ShoppingListItems from '@/components/shopping-lists/ShoppingListItems'
import { useShoppingList } from '@/hooks/useShoppingList'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ShopPage() {
    const params = useParams()
    const listId = params.id as string

    const {
        shoppingList,
        items,
        fetchList,
        addItem,
        toggleItem,
        deleteItem
    } = useShoppingList()

    useEffect(() => {
        fetchList(listId)
    }, [fetchList, listId])

    if (!shoppingList) {
        return <div>Loading...</div>
    }

    const completedItems = items.filter(item => item.completed)
    const remainingItems = items.filter(item => !item.completed)

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">{shoppingList.name}</CardTitle>
                    <p className="text-muted-foreground">
                        {completedItems.length} of {items.length} items completed
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Remaining Items</h2>
                            <ShoppingListItems
                                items={remainingItems}
                                onItemToggle={toggleItem}
                                onItemDelete={deleteItem}
                                onItemAdd={addItem}
                            />
                        </div>
                        {completedItems.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold mb-2">Completed Items</h2>
                                <ShoppingListItems
                                    items={completedItems}
                                    onItemToggle={toggleItem}
                                    onItemDelete={deleteItem}
                                    onItemAdd={addItem}
                                />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
            <div className="mt-6 flex justify-end">
                <Button onClick={() => console.log('Finish shopping')}>
                    Finish Shopping
                </Button>
            </div>
        </div>
    )
}