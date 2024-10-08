/*
Developer: Mathias Holst Seeger
Date: 08-10-2024
Description:
*/


import React from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ShoppingListItem } from '@/types'

interface ShoppingListItemsProps {
    items: ShoppingListItem[]
    onItemToggle: (id: string, checked: boolean) => void
    onItemDelete: (id: string) => void
    onItemAdd: (name: string) => void
}

export default function ShoppingListItems({ items, onItemToggle, onItemDelete, onItemAdd }: ShoppingListItemsProps) {
    const [newItemName, setNewItemName] = React.useState('')

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault()
        if (newItemName.trim()) {
            onItemAdd(newItemName.trim())
            setNewItemName('')
        }
    }

    return (
        <div className="space-y-4">
            <form onSubmit={handleAddItem} className="flex gap-2">
                <Input
                    type="text"
                    placeholder="Add new item"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                />
                <Button type="submit">Add</Button>
            </form>
            <ul className="space-y-2">
                {items.map((item) => (
                    <li key={item.id} className="flex items-center gap-2">
                        <Checkbox
                            checked={item.completed}
                            onCheckedChange={(checked) => onItemToggle(item.id, checked as boolean)}
                        />
                        <span className={item.completed ? 'line-through text-muted-foreground' : ''}>
              {item.name}
            </span>
                        <Button variant="ghost" size="sm" onClick={() => onItemDelete(item.id)}>
                            Delete
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    )
}