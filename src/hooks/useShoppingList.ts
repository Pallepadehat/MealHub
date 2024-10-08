/*
Developer: Mathias Holst Seeger
Date: 08-10-2024
Description:
*/

import { useState, useCallback } from 'react'
import { ShoppingList, ShoppingListItem } from '@/types'

export function useShoppingList(initialList?: ShoppingList) {
    const [shoppingList, setShoppingList] = useState<ShoppingList | null>(initialList || null)
    const [items, setItems] = useState<ShoppingListItem[]>([])

    const fetchList = useCallback(async (id: string) => {
        // In a real app, this would be an API call
        const mockList: ShoppingList = {
            id,
            name: 'Mock Shopping List',
            itemCount: 3,
            createdAt: new Date().toISOString(),
        }
        setShoppingList(mockList)

        // Fetch items
        const mockItems: ShoppingListItem[] = [
            { id: '1', name: 'Apples', completed: false },
            { id: '2', name: 'Bread', completed: true },
            { id: '3', name: 'Milk', completed: false },
        ]
        setItems(mockItems)
    }, [])

    const addItem = useCallback((name: string) => {
        const newItem: ShoppingListItem = {
            id: Date.now().toString(),
            name,
            completed: false,
        }
        setItems((prevItems) => [...prevItems, newItem])
        setShoppingList((prevList) =>
            prevList ? { ...prevList, itemCount: prevList.itemCount + 1 } : null
        )
    }, [])

    const toggleItem = useCallback((id: string, completed: boolean) => {
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, completed } : item
            )
        )
    }, [])

    const deleteItem = useCallback((id: string) => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id))
        setShoppingList((prevList) =>
            prevList ? { ...prevList, itemCount: prevList.itemCount - 1 } : null
        )
    }, [])

    return {
        shoppingList,
        items,
        fetchList,
        addItem,
        toggleItem,
        deleteItem,
    }
}