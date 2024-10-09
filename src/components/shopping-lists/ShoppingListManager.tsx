'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useShoppingList } from '@/hooks/useShoppingList';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Trash2, Calendar, Edit } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { databases, ID, Query } from '@/lib/appwrite';

import { Models } from 'appwrite';

interface Document extends Models.Document {
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
}

interface ShoppingList extends Document {
  name: string;
  userId: string;
  intendedDate: string;
  status: 'active' | 'deprecated' | 'done';
}

interface ShoppingListItem extends Document {
  shoppingListId: string;
  ingredientId: string;
  quantity: string;
  inBasket: boolean;
  category: string;
}

interface Ingredient extends Document {
  name: string;
  category: string;
  userId: string;
}

interface Category extends Document {
  name: string;
  userId: string;
}

export function ShoppingListManager() {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [activeList, setActiveList] = useState<ShoppingList | null>(null);
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { user } = useAuth();
  const { createShoppingList, addItemToShoppingList, removeItemFromShoppingList, toggleItemInBasket, updateShoppingListDate } = useShoppingList();

  useEffect(() => {
    if (user) {
      fetchShoppingLists();
      fetchIngredients();
      fetchCategories();
    }
  }, [user]);

  const fetchShoppingLists = async () => {
    try {
      const response = await databases.listDocuments<ShoppingList>(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_SHOPPING_LISTS_COLLECTION_ID!,
        [Query.equal('userId', user!.$id)]
      );
      setShoppingLists(response.documents);
      if (response.documents.length > 0) {
        setActiveList(response.documents[0]);
        fetchShoppingListItems(response.documents[0].$id);
      }
    } catch (error) {
      console.error('Error fetching shopping lists:', error);
      toast.error('Failed to load shopping lists');
    }
  };

  const fetchShoppingListItems = async (listId: string) => {
    try {
      const response = await databases.listDocuments<ShoppingListItem>(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_SHOPPING_LIST_ITEMS_COLLECTION_ID!,
        [Query.equal('shoppingListId', listId)]
      );
      setItems(response.documents);
    } catch (error) {
      console.error('Error fetching shopping list items:', error);
      toast.error('Failed to load shopping list items');
    }
  };

  const fetchIngredients = async () => {
    try {
      const response = await databases.listDocuments<Ingredient>(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_INGREDIENTS_COLLECTION_ID!,
        [Query.equal('userId', user!.$id)]
      );
      setIngredients(response.documents);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      toast.error('Failed to load ingredients');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await databases.listDocuments<Category>(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!,
        [Query.equal('userId', user!.$id)]
      );
      setCategories(response.documents);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const handleAddItem = async () => {
    if (!newItemName || !newItemCategory || !activeList) {
      toast.error('Please enter an item name, select a category, and ensure a list is active');
      return;
    }

    try {
      await addItemToShoppingList(activeList.$id, {
        ingredientId: newItemName,
        category: newItemCategory,
        quantity: newItemQuantity,
        unit: newItemUnit,
        inBasket: false,
        shoppingListId: activeList.$id
      });
      setNewItemName('');
      setNewItemCategory('');
      setNewItemQuantity('');
      setNewItemUnit('');
      fetchShoppingListItems(activeList.$id);
    } catch (error) {
      console.error('Error adding item to shopping list:', error);
      toast.error('Failed to add item to shopping list');
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeItemFromShoppingList(itemId);
      if (activeList) {
        fetchShoppingListItems(activeList.$id);
      }
    } catch (error) {
      console.error('Error removing item from shopping list:', error);
      toast.error('Failed to remove item from shopping list');
    }
  };

  const handleToggleInBasket = async (itemId: string) => {
    try {
      await toggleItemInBasket(itemId);
      if (activeList) {
        fetchShoppingListItems(activeList.$id);
      }
    } catch (error) {
      console.error('Error toggling item in basket:', error);
      toast.error('Failed to update item status');
    }
  };

  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    if (activeList) {
      try {
        await updateShoppingListDate(activeList.$id, newDate);
        fetchShoppingLists();
      } catch (error) {
        console.error('Error updating shopping list date:', error);
        toast.error('Failed to update shopping list date');
      }
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName) {
      toast.error('Please enter a category name');
      return;
    }

    try {
      await databases.createDocument<Category>(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!,
        ID.unique(),
        {
          name: newCategoryName,
          userId: user!.$id,
          createdAt: new Date().toISOString(),
        }
      );
      setNewCategoryName('');
      fetchCategories();
      toast.success('Category added successfully');
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    }
  };

  const handleEditIngredient = async () => {
    if (!editingIngredient) return;

    try {
      await databases.updateDocument<Ingredient>(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_INGREDIENTS_COLLECTION_ID!,
        editingIngredient.$id,
        {
          name: editingIngredient.name,
          category: editingIngredient.category,
        }
      );
      setEditingIngredient(null);
      fetchIngredients();
      toast.success('Ingredient updated successfully');
    } catch (error) {
      console.error('Error updating ingredient:', error);
      toast.error('Failed to update ingredient');
    }
  };

  const handleEditCategory = async () => {
    if (!editingCategory) return;

    try {
      await databases.updateDocument<Category>(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!,
        editingCategory.$id,
        {
          name: editingCategory.name,
        }
      );
      setEditingCategory(null);
      fetchCategories();
      toast.success('Category updated successfully');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Shopping List Manager</h1>
      <Tabs defaultValue="current">
        <TabsList>
          <TabsTrigger value="current">Current List</TabsTrigger>
          <TabsTrigger value="history">Shopping History</TabsTrigger>
          <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="current">
          {activeList && (
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{activeList.name}</span>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <Input
                      type="date"
                      value={activeList.intendedDate}
                      onChange={handleDateChange}
                      className="w-40"
                    />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <Input
                    placeholder="Item name"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                  />
                  <Select value={newItemCategory} onValueChange={setNewItemCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.$id} value={category.$id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Quantity"
                    value={newItemQuantity}
                    onChange={(e) => setNewItemQuantity(e.target.value)}
                  />
                  <Input
                    placeholder="Unit"
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                  />
                </div>
                <Button onClick={handleAddItem}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                </Button>
                {items.map((item) => (
                  <div key={item.$id} className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <Checkbox
                        checked={item.inBasket}
                        onCheckedChange={() => handleToggleInBasket(item.$id)}
                        id={`item-${item.$id}`}
                      />
                      <label
                        htmlFor={`item-${item.$id}`}
                        className={`ml-2 ${item.inBasket ? 'line-through text-gray-500' : ''}`}
                      >
                        {item.quantity} {ingredients.find(ing => ing.$id === item.ingredientId)?.name}
                      </label>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(item.$id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Shopping History</CardTitle>
            </CardHeader>
            <CardContent>
              {shoppingLists.map((list) => (
                <div key={list.$id} className="flex justify-between items-center py-2">
                  <span>{list.name}</span>
                  <span>{new Date(list.intendedDate).toLocaleDateString()}</span>
                  <span>{list.status}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ingredients">
          <Card>
            <CardHeader>
              <CardTitle>Ingredients</CardTitle>
            </CardHeader>
            <CardContent>
              {ingredients.map((ingredient) => (
                <div key={ingredient.$id} className="flex justify-between items-center py-2">
                  <span>{ingredient.name}</span>
                  <span>{ingredient.category}</span>
                  <Button variant="ghost" size="sm" onClick={() => setEditingIngredient(ingredient)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
          <Dialog open={!!editingIngredient} onOpenChange={() => setEditingIngredient(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Ingredient</DialogTitle>
              </DialogHeader>
              {editingIngredient && (
                <div className="space-y-4">
                  <Input
                    value={editingIngredient.name}
                    onChange={(e) =>
                      setEditingIngredient({ ...editingIngredient, name: e.target.value })
                    }
                    placeholder="Ingredient name"
                  />
                  <Select
                    value={editingIngredient.category}
                    onValueChange={(value) =>
                      setEditingIngredient({ ...editingIngredient, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.$id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleEditIngredient}>Save Changes</Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <Input
                  placeholder="New category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <Button onClick={handleAddCategory}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Category
                </Button>
              </div>
              {categories.map((category) => (
                <div key={category.$id} className="flex justify-between items-center py-2">
                  <span>{category.name}</span>
                  <Button variant="ghost" size="sm" onClick={() => setEditingCategory(category)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
          <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Category</DialogTitle>
              </DialogHeader>
              {editingCategory && (
                <div className="space-y-4">
                  <Input
                    value={editingCategory.name}
                    onChange={(e) =>
                      setEditingCategory({ ...editingCategory, name: e.target.value })
                    }
                    placeholder="Category name"
                  />
                  <Button onClick={handleEditCategory}>Save Changes</Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
}
