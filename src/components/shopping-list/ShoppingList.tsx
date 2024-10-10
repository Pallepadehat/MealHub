'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Edit, Trash2, Archive, History, RefreshCcw, Check, Plus, Search } from 'lucide-react'
import { databases } from '@/lib/appwrite'
import { Query, ID } from 'appwrite'
import { toast } from 'react-hot-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import ImportFromMeal from './ImportFromMeal'
import EditShoppingItem from './EditShoppingItem'

interface Ingredient {
  id: string
  name: string
  quantity: string
  unit: string
  category: string
}

interface ShoppingItem extends Ingredient {
  checked: boolean
}

interface ShoppingList {
  id: string
  name: string
  createdAt: string
  isDone: boolean
}

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

  useEffect(() => {
    if (user) {
      fetchShoppingLists()
    }
  }, [user])

  useEffect(() => {
    if (currentList) {
      fetchListItems(currentList.id)
      setEditedListName(currentList.name)
    }
  }, [currentList])

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
            category: item.category,
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

  const groupedItems = listItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, ShoppingItem[]>)

  const activeLists = shoppingLists.filter(list => !list.isDone)
  const completedLists = shoppingLists.filter(list => list.isDone)

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader>
        <CardTitle className="text-3xl font-bold flex items-center justify-between text-primary">
          <div className="flex items-center">
            <ShoppingCart className="mr-2 h-8 w-8" />
            MealHub Shopping Lists
          </div>
        </CardTitle>
        <CardDescription>Manage your shopping lists with ease</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
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
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Button onClick={createNewList} className="flex-grow">
                  <Plus className="mr-2 h-5 w-5" /> New List
                </Button>
                <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-grow">Import from  Meal</Button>
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
                <Card className="bg-card">
                  <CardHeader className="pb-2">
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
                  <CardContent>
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
                        <Button onClick={addItem} disabled={!newItem.trim()}>
                          <Plus className="mr-2 h-4 w-4" /> Add
                        </Button>
                      </div>
                      {suggestions.length > 0 && (
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
                      )}
                      <ScrollArea className="h-[400px] pr-4">
                        {Object.entries(groupedItems).map(([category, items]) => (
                          <div key={category} className="mb-4">
                            <h3 className="text-lg font-semibold mb-2">{category}</h3>
                            {items.map((item) => (
                              <div key={item.id} className="flex items-center space-x-2 py-2 border-b">
                                <Checkbox
                                  checked={item.checked}
                                  onCheckedChange={() => toggleItemCheck(item.id)}
                                  id={`item-${item.id}`}
                                />
                                <label
                                  htmlFor={`item-${item.id}`}
                                  className={`flex-grow ${item.checked ? 'line-through text-muted-foreground' : ''}`}
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
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ))}
                      </ScrollArea>
                    </div>
                  </CardContent>
                </Card>
              )}
              {activeLists.length === 0 && (
                <Card className="bg-muted">
                  <CardContent className="flex flex-col items-center justify-center h-40">
                    <p className="text-center text-muted-foreground mb-4">
                      You don't have any active shopping lists.
                    </p>
                    <Button onClick={createNewList}>
                      <Plus className="mr-2 h-4 w-4" /> Create a New List
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          <TabsContent value="history">
            <ScrollArea className="h-[600px] pr-4">
              {completedLists.map((list) => (
                <Card key={list.id} className="mb-4 bg-muted/50">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{list.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleListCompletion(list.id, false)}
                      >
                        <RefreshCcw className="h-5 w-5" />
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      Completed on: {new Date(list.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
              {completedLists.length === 0 && (
                <Card className="bg-muted">
                  <CardContent className="flex items-center justify-center h-40">
                    <p className="text-center text-muted-foreground">
                      You don't have any completed shopping lists yet.
                    </p>
                  </CardContent>
                </Card>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
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
    </Card>
  )
}
