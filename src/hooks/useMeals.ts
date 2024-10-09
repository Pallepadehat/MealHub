import { useState, useEffect } from 'react';
import { databases, ID, Query } from '@/lib/appwrite';
import { toast } from 'react-hot-toast';
import { useAuth } from './useAuth';

import { Models } from 'appwrite';

export interface Ingredient {
  ingredientId: string;
  quantity: string;
  unit: string;
}

export interface NewMeal {
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string;
  userId: string;
  servings: string;
  prepTime: string;
  createdAt: string;
}

export interface Meal extends NewMeal, Models.Document {}

export const useMeals = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMeals();
    }
  }, [user]);

  const fetchMeals = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const response = await databases.listDocuments<Meal>(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_MEALS_COLLECTION_ID!,
        [Query.equal('userId', user.$id)]
      );
      setMeals(response.documents);
    } catch (error) {
      console.error('Error fetching meals:', error);
      setError('Failed to fetch meals');
      toast.error('Failed to fetch meals');
    } finally {
      setLoading(false);
    }
  };

  const addMeal = async (newMeal: NewMeal) => {
    setError(null);
    try {
      const response = await databases.createDocument<Meal>(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_MEALS_COLLECTION_ID!,
        ID.unique(),
        newMeal
      );
      setMeals([...meals, response]);
      toast.success('Meal added successfully');
    } catch (error) {
      console.error('Error adding meal:', error);
      setError('Failed to add meal');
      toast.error('Failed to add meal');
    }
  };

  const updateMeal = async (mealId: string, updatedMeal: Partial<NewMeal>) => {
    setError(null);
    try {
      const response = await databases.updateDocument<Meal>(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_MEALS_COLLECTION_ID!,
        mealId,
        updatedMeal
      );
      setMeals(meals.map(meal => meal.$id === mealId ? response : meal));
      toast.success('Meal updated successfully');
    } catch (error) {
      console.error('Error updating meal:', error);
      setError('Failed to update meal');
      toast.error('Failed to update meal');
    }
  };

  const deleteMeal = async (mealId: string) => {
    setError(null);
    try {
      await databases.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_MEALS_COLLECTION_ID!,
        mealId
      );
      setMeals(meals.filter(meal => meal.$id !== mealId));
      toast.success('Meal deleted successfully');
    } catch (error) {
      console.error('Error deleting meal:', error);
      setError('Failed to delete meal');
      toast.error('Failed to delete meal');
    }
  };

  const getMealById = (mealId: string) => {
    return meals.find(meal => meal.$id === mealId);
  };

  const getMeals = async () => {
    if (!user) return [];
    setError(null);
    setLoading(true);
    try {
      const response = await databases.listDocuments<Meal>(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_MEALS_COLLECTION_ID!,
        [Query.equal('userId', user.$id)]
      );
      setMeals(response.documents);
      return response.documents;
    } catch (error) {
      console.error('Error fetching meals:', error);
      setError('Failed to fetch meals');
      toast.error('Failed to fetch meals');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getMeal = async (id: string) => {
    setError(null);
    setLoading(true);
    try {
      const meal = await databases.getDocument<Meal>(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_MEALS_COLLECTION_ID!,
        id
      );
      return meal;
    } catch (error) {
      console.error('Error fetching meal:', error);
      setError('Failed to fetch meal');
      toast.error('Failed to fetch meal');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    meals,
    loading,
    error,
    addMeal,
    updateMeal,
    deleteMeal,
    getMealById,
    getMeals,
    getMeal,
    fetchMeals,
  };
};
