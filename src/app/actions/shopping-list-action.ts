'use server'

import { databases } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  checked: boolean;
}

export interface ShoppingList {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}

export async function getActiveShoppingList(userId: string): Promise<ShoppingList | null> {
  try {
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_SHOPPING_LISTS_ID!,
      [
        Query.equal('userId', userId),
        Query.equal('isActive', true),
        Query.limit(1)
      ]
    );

    if (response.documents.length === 0) {
      return null;
    }

    const activeList = response.documents[0];
    return {
      id: activeList.$id,
      name: activeList.name,
      isActive: activeList.isActive,
      createdAt: activeList.$createdAt,
    };
  } catch (error) {
    console.error('Error fetching active shopping list:', error);
    return null;
  }
}

export async function createShoppingList(userId: string, name: string): Promise<ShoppingList | null> {
  try {
    // First, set all existing lists to inactive
    await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_SHOPPING_LISTS_ID!,
      [Query.equal('userId', userId), Query.equal('isActive', true)]
    ).then(response => {
      response.documents.forEach(doc => {
        databases.updateDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_SHOPPING_LISTS_ID!,
          doc.$id,
          { isActive: false }
        );
      });
    });

    // Create new active shopping list
    const response = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_SHOPPING_LISTS_ID!,
      ID.unique(),
      {
        userId,
        name,
        isActive: true,
      }
    );

    return {
      id: response.$id,
      name: response.name,
      isActive: response.isActive,
      createdAt: response.$createdAt,
    };
  } catch (error) {
    console.error('Error creating shopping list:', error);
    return null;
  }
}

export async function getShoppingListItems(userId: string, limit?: number) {
  try {
    const activeList = await getActiveShoppingList(userId);
    if (!activeList) {
      return [];
    }

    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_SHOPPING_LIST_ITEMS_ID!,
      [
        Query.equal('shoppingListId', activeList.id),
        Query.orderDesc('$createdAt'),
        ...(limit ? [Query.limit(limit)] : []),
      ]
    );

    return response.documents.map(doc => ({
      id: doc.$id,
      name: doc.name,
      quantity: doc.quantity,
      category: doc.category,
      checked: doc.checked,
    }));
  } catch (error) {
    console.error('Error fetching shopping list items:', error);
    return [];
  }
}

export async function addShoppingItem(userId: string, item: Omit<ShoppingItem, 'id'>) {
  try {
    const activeList = await getActiveShoppingList(userId);
    if (!activeList) {
      throw new Error('No active shopping list found');
    }

    const response = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_SHOPPING_LIST_ITEMS_ID!,
      ID.unique(),
      {
        shoppingListId: activeList.id,
        ...item,
      }
    );

    return {
      success: true,
      item: {
        id: response.$id,
        name: response.name,
        quantity: response.quantity,
        category: response.category,
        checked: response.checked,
      },
    };
  } catch (error) {
    console.error('Error adding shopping item:', error);
    return { success: false, error: 'Failed to add item' };
  }
}


/*
Developer: Patrick Jakobsen
Date: 10-10-2024
*/
