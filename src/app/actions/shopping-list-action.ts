'use server'

import { databases } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';

// Define the structure for a shopping item
export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  checked: boolean;
}

// Define the structure for a shopping list
export interface ShoppingList {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}

// Function to retrieve the active shopping list for a user
export async function getActiveShoppingList(userId: string): Promise<ShoppingList | null> {
  try {
    // Query the database for the active shopping list
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_SHOPPING_LISTS_ID!,
      [
        Query.equal('userId', userId),
        Query.equal('isActive', true),
        Query.limit(1)
      ]
    );

    // If no active list is found, return null
    if (response.documents.length === 0) {
      return null;
    }

    // Extract and return the active list details
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

// Function to create a new shopping list
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

    // Return the newly created shopping list
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

// Function to retrieve items from the active shopping list
export async function getShoppingListItems(userId: string, limit?: number) {
  try {
    // Get the active shopping list
    const activeList = await getActiveShoppingList(userId);
    if (!activeList) {
      return [];
    }

    // Query the database for items in the active shopping list
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_SHOPPING_LIST_ITEMS_ID!,
      [
        Query.equal('shoppingListId', activeList.id),
        Query.orderDesc('$createdAt'),
        ...(limit ? [Query.limit(limit)] : []),
      ]
    );

    // Map the response to ShoppingItem objects
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

// Function to add a new item to the active shopping list
export async function addShoppingItem(userId: string, item: Omit<ShoppingItem, 'id'>) {
  try {
    // Get the active shopping list
    const activeList = await getActiveShoppingList(userId);
    if (!activeList) {
      throw new Error('No active shopping list found');
    }

    // Create a new item in the database
    const response = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_SHOPPING_LIST_ITEMS_ID!,
      ID.unique(),
      {
        shoppingListId: activeList.id,
        ...item,
      }
    );

    // Return the newly created item
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
