import { useState, useEffect } from 'react';
import { databases, ID, Query } from '@/lib/appwrite';
import { toast } from 'react-hot-toast';
import { useAuth } from './useAuth';

import { Models } from 'appwrite';

export interface Ingredient extends Models.Document {
  name: string;
  category: string;
  userId: string;
}

export const useIngredients = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchIngredients();
    }
  }, [user]);

  const fetchIngredients = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await databases.listDocuments<Ingredient>(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_INGREDIENTS_COLLECTION_ID!,
        [Query.equal('userId', user.$id)]
      );
      setIngredients(response.documents);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      toast.error('Failed to fetch ingredients');
    } finally {
      setLoading(false);
    }
  };

  const addIngredient = async (newIngredient: Omit<Ingredient, '$id' | '$createdAt' | '$updatedAt' | '$permissions' | '$collectionId' | '$databaseId'>) => {
    try {
      const response = await databases.createDocument<Ingredient>(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_INGREDIENTS_COLLECTION_ID!,
        ID.unique(),
        newIngredient
      );
      setIngredients([...ingredients, response]);
      toast.success('Ingredient added successfully');
      return response;
    } catch (error) {
      console.error('Error adding ingredient:', error);
      toast.error('Failed to add ingredient');
      throw error;
    }
  };

  const updateIngredient = async (ingredientId: string, updatedIngredient: Partial<Ingredient>) => {
    try {
      const response = await databases.updateDocument<Ingredient>(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_INGREDIENTS_COLLECTION_ID!,
        ingredientId,
        updatedIngredient
      );
      setIngredients(ingredients.map(ing => ing.$id === ingredientId ? { ...ing, ...response } : ing));
      toast.success('Ingredient updated successfully');
    } catch (error) {
      console.error('Error updating ingredient:', error);
      toast.error('Failed to update ingredient');
    }
  };

  const deleteIngredient = async (ingredientId: string) => {
    try {
      await databases.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_INGREDIENTS_COLLECTION_ID!,
        ingredientId
      );
      setIngredients(ingredients.filter(ing => ing.$id !== ingredientId));
      toast.success('Ingredient deleted successfully');
    } catch (error) {
      console.error('Error deleting ingredient:', error);
      toast.error('Failed to delete ingredient');
    }
  };

  const getIngredientById = (ingredientId: string) => {
    return ingredients.find(ing => ing.$id === ingredientId);
  };

  return {
    ingredients,
    loading,
    addIngredient,
    updateIngredient,
    deleteIngredient,
    getIngredientById,
    fetchIngredients,
  };
};
