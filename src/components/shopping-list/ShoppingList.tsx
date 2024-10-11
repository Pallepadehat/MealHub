'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Edit, Trash2, Archive, History, RefreshCcw, Check, Plus, Search, UtensilsCrossed } from 'lucide-react'
import { databases } from '@/lib/appwrite'
import { Query, ID } from 'appwrite'
import { toast } from 'react-hot-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from 'framer-motion'
import ImportFromMeal from './ImportFromMeal'
import EditShoppingItem from './EditShoppingItem'

// Interface for the Ingredient structure
interface Ingredient {
  id: string
  name: string
  quantity: string
  unit: string
  category: string
}

// Interface for the ShoppingItem structure, extending Ingredient
interface ShoppingItem extends Ingredient {
  checked: boolean
}

// Interface for the ShoppingList structure
interface ShoppingList {
  id: string
  name: string
  createdAt: string
  isDone: boolean
}

// ShoppingList component: Manages shopping lists and their items
export default function ShoppingList() {
  const { user } = useAuth()
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([])
  const [currentList, setCurrentList] = useState<ShoppingList | null>(null)
  const [listItems, setListItems] = useState<ShoppingItem[]>([])
  const [newItem, setNewItem] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState<Ingredient[]>([])
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null)
  const [activeTab, setActiveTab] = useState('active')
  const [isEditingListName, setIsEditingListName] = useState(false)
  const [editedListName, setEditedListName] = useState('')

  // Fetch shopping lists when the component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchShoppingLists()
    }
  }, [user])

  // Fetch list items when the current list changes
  useEffect(() => {
    if (currentList) {
      fetchListItems(currentList.id)
      setEditedListName(currentList.name)
    }
  }, [currentList])

  // Fetch shopping lists from the database
  const fetchShoppingLists = async () => {
    try {
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_SHOPPING_LISTS_ID!,
        [Query.equal('userId', user!.id), Query.orderDesc('createdAt')]
      )
      const lists = response.documents.map(doc => ({
        id: doc.$id,
        name: doc.name,
        createdAt: doc.createdAt,
        isDone: doc.isDone
      }))
      setShoppingLists(lists)
      const activeLists = lists.filter(list => !list.isDone)
      if (activeLists.length === 1) {
        setCurrentList(activeLists[0])
      } else {
        setCurrentList(null)
      }
    } catch (error) {
      console.error('Error fetching shopping lists:', error)
      toast.error('Failed to load shopping lists')
    }
  }

  // Fetch items for a specific shopping list
  const fetchListItems = async (listId: string) => {
    try {
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_SHOPPING_LIST_ITEMS_ID!,
        [Query.equal('listId', listId)]
      )
      const items = response.documents.map(doc => ({
        id: doc.$id,
        name: doc.name,
        quantity: doc.quantity,
        unit: doc.unit,
        category: doc.category,
        checked: doc.checked
      }))
      setListItems(items)
    } catch (error) {
      console.error('Error fetching list items:', error)
      toast.error('Failed to load list items')
    }
  }

  // Create a new shopping list
  const createNewList = async () => {
    try {
      const response = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_SHOPPING_LISTS_ID!,
        ID.unique(),
        {
          userId: user!.id,
          name: `Shopping List ${shoppingLists.length + 1}`,
          createdAt: new Date().toISOString(),
          isDone: false
        }
      )
      const newList = {
        id: response.$id,
        name: response.name,
        createdAt: response.createdAt,
        isDone: false
      }
      setShoppingLists([newList, ...shoppingLists])
      setCurrentList(newList)
      setListItems([])
      toast.success('New shopping list created')
    } catch (error) {
      console.error('Error creating new list:', error)
      toast.error('Failed to create new list')
    }
  }

  // Add a new item to the current shopping list
  const addItem = async () => {
    if (!newItem.trim() || !currentList) return
    try {
      const selectedIngredient = suggestions.find(s => s.name === newItem)
      const response = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_SHOPPING_LIST_ITEMS_ID!,
        ID.unique(),
        {
          userId: user!.id,
          listId: currentList.id,
          name: newItem,
          quantity: '1',
          unit: selectedIngredient?.unit || '',
          category: selectedIngredient?.category || 'Other',
          checked: false
        }
      )
      const newItemObj = {
        id: response.$id,
        name: response.name,
        quantity: response.quantity,
        unit: response.unit,
        category: response.category,
        checked: response.checked
      }
      setListItems([...listItems, newItemObj])
      setNewItem('')
      toast.success('Item added to shopping list')
    } catch (error) {
      console.error('Error adding item:', error)
      toast.error('Failed to add item')
    }
  }

  // Toggle the checked status of an item
  const toggleItemCheck = async (itemId: string) => {
    try {
      const item = listItems.find(item => item.id === itemId)
      if (!item) return

      const response = await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_SHOPPING_LIST_ITEMS_ID!,
        itemId,
        { checked: !item.checked }
      )
      setListItems(listItems.map(item =>
        item.id === itemId ? { ...item, checked: response.checked } : item
      ))
    } catch (error) {
      console.error('Error toggling item check:', error)
      toast.error('Failed to update item')
    }
  }

  // Delete an item from the shopping list
  const deleteItem = async (itemId: string) => {
    try {
      await databases.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_SHOPPING_LIST_ITEMS_ID!,
        itemId
      )
      setListItems(listItems.filter(item => item.id !== itemId))
      toast.success('Item deleted from shopping list')
    } catch (error) {
      console.error('Error deleting item:', error)
      toast.error('Failed to delete item')
    }
  }

  // Toggle the completion status of a shopping list
  const toggleListCompletion = async (listId: string, isDone: boolean) => {
    try {
      await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_SHOPPING_LISTS_ID!,
        listId,
        { isDone: isDone }
      )
      const updatedLists = shoppingLists.map(list =>
        list.id === listId ? { ...list, isDone: isDone } : list
      )
      setShoppingLists(updatedLists)
      if (currentList && currentList.id === listId) {
        if (isDone) {
          const nextActiveList = updatedLists.find(list => !list.isDone)
          setCurrentList(nextActiveList || null)
        } else {
          setCurrentList({ ...currentList, isDone: isDone })
        }
      }
      toast.success(isDone ? 'Shopping list marked as done' : 'Shopping list unmarked as done')
      if (isDone) {
        setActiveTab('active')
      }
    } catch (error) {
      console.error('Error toggling list completion:', error)
      toast.error('Failed to update list status')
    }
  }

  // Search for ingredients in the database
  const searchIngredients = async (term: string) => {
    setSearchTerm(term)
    if (term.length < 2) {
      setSuggestions([])
      return
    }
    try {
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_INGREDIENTS_ID!,
        [Query.search('name', term)]
      )
      setSuggestions(response.documents.map(doc => ({
        id: doc.$id,
        name: doc.name,
        quantity: '',
        unit: doc.unit,
        category: doc.category
      })))
    } catch (error) {
      console.error('Error searching ingredients:', error)
    }
  }

  // Import items from a meal to the current shopping list
  const handleImport = async (items: Ingredient[]) => {
    if (!currentList || !user) return
    try {
      const importPromises = items.map(item =>
        databases.createDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_SHOPPING_LIST_ITEMS_ID!,
          ID.unique(),
          {
            userId: user.id,
            listId: currentList.id,
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            category: item.category || 'Other',
            checked: false
          }
        )
      )
      await Promise.all(importPromises)
      await fetchListItems(currentList.id)
      toast.success('Items imported successfully')
    } catch (error) {
      console.error('Error importing items:', error)
      toast.error('Failed to import items')
    }
    setIsImportDialogOpen(false)
  }

  // Edit an existing shopping list item
  const handleEdit = async (updatedItem: ShoppingItem) => {
    try {
      await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_SHOPPING_LIST_ITEMS_ID!,
        updatedItem.id,
        {
          name: updatedItem.name,
          quantity: updatedItem.quantity,
          unit: updatedItem.unit,
          category: updatedItem.category
        }
      )
      setListItems(listItems.map(item =>
        item.id === updatedItem.id ? updatedItem : item
      ))
      toast.success('Item updated successfully')
    } catch (error) {
      console.error('Error updating item:', error)
      toast.error('Failed to update item')
    }
    setIsEditDialogOpen(false)
    setEditingItem(null)
  }

  // Handle changes to the shopping list name
  const handleListNameChange = async () => {
    if (!currentList || editedListName.trim() === currentList.name) {
      setIsEditingListName(false)
      return
    }
    try {
      await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_SHOPPING_LISTS_ID!,
        currentList.id,
        { name: editedListName.trim() }
      )
      setShoppingLists(shoppingLists.map(list =>
        list.id === currentList.id ? { ...list, name: editedListName.trim() } : list
      ))
      setCurrentList({ ...currentList, name: editedListName.trim() })
      toast.success('List name updated successfully')
    } catch (error) {
      console.error('Error updating list name:', error)
      toast.error('Failed to update list name')
    }
    setIsEditingListName(false)
  }

  // Group items by category and combine duplicates
  const groupedItems = listItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    // Check if an item with the same name already exists in this category
    const existingItem = acc[item.category].find(i => i.name === item.name)
    if (existingItem) {
      // If it exists, update the quantity
      existingItem.quantity = (parseFloat(existingItem.quantity) + parseFloat(item.quantity)).toString()
      // Merge the checked status (if any item is checked, the merged item is checked)
      existingItem.checked = existingItem.checked || item.checked
    } else {
      // If it doesn't exist, add the new item
      acc[item.category].push({ ...item })
    }
    return acc
  }, {} as Record<string, ShoppingItem[]>)

  const activeLists = shoppingLists.filter(list => !list.isDone)
  const completedLists = shoppingLists.filter(list => list.isDone)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="text-center bg-gradient-to-r from-blue-600  to-indigo-600 p-8">
          <div className="flex justify-center  mb-6">
            <UtensilsCrossed size={64} className="text-white" />
          </div>
          <CardTitle className="text-4xl font-bold text-white mb-2">MealHub Shopping Lists</CardTitle>
          <CardDescription className="text-blue-100 text-lg">Manage your shopping lists with ease</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="active" className="text-lg">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Active Lists
              </TabsTrigger>
              <TabsTrigger value="history" className="text-lg">
                <History className="mr-2 h-5 w-5" />
                History
              </TabsTrigger>
            </TabsList>
            <TabsContent value="active">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-4">
                  <Button onClick={createNewList} className="flex-grow bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="mr-2 h-5 w-5" /> New List
                  </Button>
                  <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-grow">Import from Meal</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Import from Meal</DialogTitle>
                      </DialogHeader>
                      <ImportFromMeal onImport={handleImport} />
                    </DialogContent>
                  </Dialog>
                </div>
                {activeLists.length > 1 && (
                  <Select
                    value={currentList?.id || ''}
                    onValueChange={(value) =>
                      setCurrentList(activeLists.find(list => list.id === value) || null)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a list" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeLists.map(list => (
                        <SelectItem key={list.id} value={list.id}>
                          {list.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {currentList && (
                  <Card className="bg-white shadow-md rounded-lg overflow-hidden">
                    <CardHeader className="bg-blue-50 pb-2">
                      <CardTitle className="text-2xl font-semibold flex items-center justify-between">
                        {isEditingListName ? (
                          <Input
                            value={editedListName}
                            onChange={(e) => setEditedListName(e.target.value)}
                            onBlur={handleListNameChange}
                            onKeyPress={(e) => e.key === 'Enter' && handleListNameChange()}
                            className="text-2xl font-semibold"
                          />
                        ) : (
                          <span onClick={() => setIsEditingListName(true)}>{currentList.name}</span>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleListCompletion(currentList.id, true)}
                        >
                          <Check className="h-5 w-5" />
                        </Button>
                      </CardTitle>
                      <CardDescription>
                        Created on: {new Date(currentList.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <div className="relative flex-grow">
                            <Input
                              type="text"
                              placeholder="Add new item or search..."
                              value={newItem || searchTerm}
                              onChange={(e) => {
                                const value = e.target.value
                                setNewItem(value)
                                searchIngredients(value)
                              }}
                              className="pr-10"
                            />
                            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          </div>
                          <Button onClick={addItem} disabled={!newItem.trim()} className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Plus className="mr-2 h-4 w-4" /> Add
                          </Button>
                        </div>
                        <AnimatePresence>
                          {suggestions.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Card className="mt-2">
                                <CardContent className="p-2">
                                  <ScrollArea className="h-32">
                                    {suggestions.map((suggestion, index) => (
                                      <Button
                                        key={index}
                                        variant="ghost"
                                        className="w-full justify-start"
                                        onClick={() => {
                                          setNewItem(suggestion.name)
                                          setSuggestions([])
                                        }}
                                      >
                                        {suggestion.name}
                                      </Button>
                                    ))}
                                  </ScrollArea>
                                </CardContent>
                              </Card>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <ScrollArea className="h-[400px] pr-4">
                          <AnimatePresence>
                            {Object.entries(groupedItems).map(([category, items]) => (
                              <motion.div
                                key={category}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="mb-4"
                              >
                                <h3 className="text-lg font-semibold mb-2 text-blue-700">{category}</h3>
                                {items.map((item) => (
                                  <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-center space-x-2 py-2 border-b border-blue-100"
                                  >
                                    <Checkbox
                                      checked={item.checked}
                                      onCheckedChange={() => toggleItemCheck(item.id)}
                                      id={`item-${item.id}`}
                                    />
                                    <label
                                      htmlFor={`item-${item.id}`}
                                      className={`flex-grow ${item.checked ? 'line-through text-blue-400' : 'text-blue-800'}`}
                                    >
                                      {item.name} {item.quantity && `(${item.quantity} ${item.unit})`}
                                    </label>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setEditingItem(item)
                                        setIsEditDialogOpen(true)
                                      }}
                                    >
                                      <Edit className="h-4 w-4 text-blue-500" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => deleteItem(item.id)}
                                    >
                                      <Trash2 className="h-4 w-4 text-blue-500" />
                                    </Button>
                                  </motion.div>
                                ))}
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </ScrollArea>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {activeLists.length === 0 && (
                  <Card className="bg-blue-50">
                    <CardContent className="flex flex-col items-center justify-center h-40">
                      <p className="text-center text-blue-600 mb-4">
                        You don't have any active shopping lists.
                      </p>
                      <Button onClick={createNewList} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Create a New List
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </TabsContent>
            <TabsContent value="history">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <ScrollArea className="h-[600px] pr-4">
                  <AnimatePresence>
                    {completedLists.map((list) => (
                      <motion.div
                        key={list.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="mb-4 bg-blue-50">
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between text-blue-700">
                              <span>{list.name}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleListCompletion(list.id, false)}
                              >
                                <RefreshCcw className="h-5 w-5 text-blue-500" />
                              </Button>
                            </CardTitle>
                            <CardDescription className="text-blue-600">
                              Completed on: {new Date(list.createdAt).toLocaleDateString()}
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {completedLists.length === 0 && (
                    <Card className="bg-blue-50">
                      <CardContent className="flex items-center justify-center h-40">
                        <p className="text-center text-blue-600">
                          You don't have any completed shopping lists yet.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </ScrollArea>
              </motion.div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="bg-gray-50 p-6">
          <p className="text-sm text-gray-500 text-center w-full">
            MealHub - Your personal meal planning assistant
          </p>
        </CardFooter>
      </Card>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <EditShoppingItem item={editingItem} onSave={handleEdit} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

/*
Developer: Patrick Jakobsen
Date: 10-10-2024
*/
