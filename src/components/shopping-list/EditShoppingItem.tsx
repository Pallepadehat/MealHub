'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Interface for the shopping item structure
interface ShoppingItem {
  id: string
  name: string
  quantity: string
  unit: string
  category: string
  checked: boolean
}

// Props interface for the EditShoppingItem component
interface EditShoppingItemProps {
  item: ShoppingItem
  onSave: (updatedItem: ShoppingItem) => void
}

// EditShoppingItem component: Allows editing of a shopping item
export default function EditShoppingItem({ item, onSave }: EditShoppingItemProps) {
  // State to hold the edited item
  const [editedItem, setEditedItem] = useState<ShoppingItem>(item)

  // Handle changes in input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedItem(prev => ({ ...prev, [name]: value }))
  }

  // Handle changes in the category select field
  const handleCategoryChange = (value: string) => {
    setEditedItem(prev => ({ ...prev, category: value }))
  }

  // Handle save action
  const handleSave = () => {
    onSave(editedItem)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={editedItem.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          name="quantity"
          value={editedItem.quantity}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="unit">Unit</Label>
        <Input
          id="unit"
          name="unit"
          value={editedItem.unit}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={editedItem.category} onValueChange={handleCategoryChange}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Produce">Produce</SelectItem>
            <SelectItem value="Dairy">Dairy</SelectItem>
            <SelectItem value="Meat">Meat</SelectItem>
            <SelectItem value="Bakery">Bakery</SelectItem>
            <SelectItem value="Pantry">Pantry</SelectItem>
            <SelectItem value="Frozen">Frozen</SelectItem>
            <SelectItem value="Beverages">Beverages</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleSave}>Save Changes</Button>
    </div>
  )
}

/*
Developer: Patrick Jakobsen
Date: 10-10-2024
*/
