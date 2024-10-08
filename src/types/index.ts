/*
Developer: Mathias Holst Seeger
Date: 08-10-2024
Description:
*/

export interface ShoppingList {
    id: string
    name: string
    itemCount: number
    createdAt: string
}

export interface ShoppingListItem {
    id: string
    name: string
    completed: boolean
}