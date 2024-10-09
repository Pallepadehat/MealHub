import { useState, useEffect } from 'react';
import { databases, ID, Query } from '@/lib/appwrite';
import { toast } from 'react-hot-toast';
import { useAuth } from './useAuth';

import { Models } from 'appwrite';

interface ShoppingList extends Models.Document {
  name: string;
  userId: string;
  createdAt: string;
  intendedDate: string;
  status: string;
}

interface ShoppingListItem extends Models.Document {
  shoppingListId: string;
  ingredientId: string;
  quantity: string;
  inBasket: boolean;
  category: string;
}

export const useShoppingList = () => {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [shoppingListItems, setShoppingListItems] = useState<ShoppingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchShoppingLists();
    }
  }, [user]);

  const fetchShoppingLists = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const response = await databases.listDocuments<ShoppingList>(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_SHOPPING_LISTS_COLLECTION_ID!,
        [Query.equal('userId', user.$id)]
      );
      setShoppingLists(response.documents);
    } catch (error) {
      console.error('Error fetching shopping lists:', error);
      setError('Failed to fetch shopping lists');
      toast.error('Failed to fetch shopping lists');
    } finally {
      setLoading(false);
    }
  };

  const fetchShoppingListItems = async (shoppingListId: string) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const response = await databases.listDocuments<ShoppingListItem>(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_SHOPPING_LIST_ITEMS_COLLECTION_ID!,
        [Query.equal('shoppingListId', shoppingListId)]
      );
      setShoppingListItems(response.documents);
    } catch (error) {
      console.error('Error fetching shopping list items:', error);
      setError('Failed to fetch shopping list items');
      toast.error('Failed to fetch shopping list items');
    } finally {
      setLoading(false);
    }
  };

  const createShoppingList = async (name: string, intendedDate: string) => {
    if (!user) return;
    setError(null);
    try {
      const newList = await databases.createDocument<ShoppingList>(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_SHOPPING_LISTS_COLLECTION_ID!,
        ID.unique(),
        {
          name,
          userId: user.$id,
          createdAt: new Date().toISOString(),
          intendedDate,
          status: 'active'
        }
      );
      setShoppingLists([...shoppingLists, newList]);
      toast.success('Shopping list created');
      return newList.$id;
    } catch (error) {
      console.error('Error creating shopping list:', error);
      setError('Failed to create shopping list');
      toast.error('Failed to create shopping list');
    }
  };

  const addItemToShoppingList = async (shoppingListId: string, item: Omit<ShoppingListItem, '$id' | '$createdAt' | '$updatedAt' | '$permissions' | '$collectionId' | '$databaseId'>) => {
    if (!user) return;
    setError(null);
    try {
      const newItem = await databases.createDocument<ShoppingListItem>(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_SHOPPING_LIST_ITEMS_COLLECTION_ID!,
        ID.unique(),
        {
          ...item,
          shoppingListId,
          inBasket: false
        }
      );
      setShoppingListItems([...shoppingListItems, newItem]);
      toast.success('Item added to shopping list');
    } catch (error) {
      console.error('Error adding item to shopping list:', error);
      setError('Failed to add item to shopping list');
      toast.error('Failed to add item to shopping list');
    }
  };

  const removeItemFromShoppingList = async (itemId: string) => {
    if (!user) return;
    setError(null);
    try {
      await databases.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_SHOPPING_LIST_ITEMS_COLLECTION_ID!,
        itemId
      );
      setShoppingListItems(shoppingListItems.filter(item => item.$id !== itemId));
      toast.success('Item removed from shopping list');
    } catch (error) {
      console.error('Error removing item from shopping list:', error);
      setError('Failed to remove item from shopping list');
      toast.error('Failed to remove item from shopping list');
    }
  };

  const toggleItemInBasket = async (itemId: string) => {
    if (!user) return;
    setError(null);
    try {
      const item = shoppingListItems.find(i => i.$id === itemId);
      if (item) {
        const updatedItem = await databases.updateDocument<ShoppingListItem>(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_SHOPPING_LIST_ITEMS_COLLECTION_ID!,
          itemId,
          { inBasket: !item.inBasket }
        );
        setShoppingListItems(shoppingListItems.map(i => i.$id === itemId ? updatedItem : i));
        toast.success('Item updated');
      }
    } catch (error) {
      console.error('Error toggling item in basket:', error);
      setError('Failed to update item');
      toast.error('Failed to update item');
    }
  };

  const updateShoppingListDate = async (listId: string, newDate: string) => {
    if (!user) return;
    setError(null);
    try {
      const updatedList = await databases.updateDocument<ShoppingList>(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_SHOPPING_LISTS_COLLECTION_ID!,
        listId,
        { intendedDate: newDate }
      );
      setShoppingLists(shoppingLists.map(list => list.$id === listId ? updatedList : list));
      toast.success('Shopping list date updated');
    } catch (error) {
      console.error('Error updating shopping list date:', error);
      setError('Failed to update shopping list date');
      toast.error('Failed to update shopping list date');
    }
  };

  return {
    shoppingLists,
    shoppingListItems,
    loading,
    error,
    fetchShoppingLists,
    fetchShoppingListItems,
    createShoppingList,
    addItemToShoppingList,
    removeItemFromShoppingList,
    toggleItemInBasket,
    updateShoppingListDate,
  };
};
