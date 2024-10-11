'use server'

import { databases } from '@/lib/appwrite';
import { ID, Query, Models } from 'appwrite';
import { Ingredient, Meal, MealWithIngredients, User } from '@/types';
import { createOllama } from 'ollama-ai-provider';
import { streamText } from 'ai';

// Function to save a new meal with ingredients
export async function saveMeal(meal: Omit<MealWithIngredients, 'id'>, userId: string) {
  try {
    // Prepare meal data for saving
    const mealToSave: Omit<Meal, 'id'> = {
      userId,
      name: meal.name,
      description: meal.description,
      instructions: meal.instructions,
      nutritionalBenefits: meal.nutritionalBenefits,
      mealType: meal.mealType,
      servings: meal.servings,
      prepTime: meal.prepTime,
      cookTime: meal.cookTime,
      totalTime: meal.totalTime,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      createdAt: new Date().toISOString(),
    };



    // Save meal to database
    const savedMeal = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_MEALS_ID!,
      ID.unique(),
      mealToSave
    );

    // Save ingredients associated with the meal
    const ingredientPromises = meal.ingredients.map((ingredient) =>
      databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_INGREDIENTS_ID!,
        ID.unique(),
        {
          meal_id: savedMeal.$id,
          name: ingredient.name,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          category: ingredient.category
        }
      )
    );

    await Promise.all(ingredientPromises);

    return { success: true, meal: savedMeal };
  } catch (error) {
    console.error('Error saving meal:', error);
    return { success: false, error: 'Failed to save meal' };
  }
}

// Function to update an existing meal and its ingredients
export async function updateMeal(meal: MealWithIngredients) {
  try {
    // Update meal details
    const updatedMeal = await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_MEALS_ID!,
      meal.id,
      {
        name: meal.name,
        description: meal.description,
        mealType: meal.mealType,
        instructions: meal.instructions,
        nutritionalBenefits: meal.nutritionalBenefits,
        servings: meal.servings,
        prepTime: meal.prepTime,
        cookTime: meal.cookTime,
        totalTime: meal.totalTime,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat
      }
    );

    // Delete existing ingredients
    const existingIngredients = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_INGREDIENTS_ID!,
      [Query.equal('meal_id', meal.id)]
    );

    for (const ingredient of existingIngredients.documents) {
      await databases.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_INGREDIENTS_ID!,
        ingredient.$id
      );
    }

    // Create new ingredients
    const ingredientPromises = meal.ingredients.map((ingredient) =>
      databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_INGREDIENTS_ID!,
        ID.unique(),
        {
          meal_id: meal.id,
          name: ingredient.name,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          category: ingredient.category
        }
      )
    );

    await Promise.all(ingredientPromises);

    return { success: true, meal: updatedMeal };
  } catch (error) {
    console.error('Error updating meal:', error);
    return { success: false, error: 'Failed to update meal' };
  }
}

// Function to delete a meal and its associated ingredients
export async function deleteMeal(mealId: string) {
  try {
    // Delete the meal
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_MEALS_ID!,
      mealId
    );

    // Delete associated ingredients
    const ingredientsToDelete = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_INGREDIENTS_ID!,
      [Query.equal('meal_id', mealId)]
    );

    for (const ingredient of ingredientsToDelete.documents) {
      await databases.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_INGREDIENTS_ID!,
        ingredient.$id
      );
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting meal:', error);
    return { success: false, error: 'Failed to delete meal' };
  }
}

// Function to retrieve meals for a user
export async function getMeals(userId: string, limit?: number): Promise<MealWithIngredients[]> {
  try {
    const meals = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_MEALS_ID!,
      [
        Query.equal('userId', userId),
        ...(limit ? [Query.limit(limit)] : []),
      ]
    );

    const mealsWithIngredients = await Promise.all(meals.documents.map(async (meal) => {
      const ingredients = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_INGREDIENTS_ID!,
        [Query.equal('meal_id', meal.$id)]
      );

      return {
        id: meal.$id,
        userId: meal.userId,
        name: meal.name,
        description: meal.description,
        instructions: meal.instructions,
        nutritionalBenefits: meal.nutritionalBenefits,
        mealType: meal.mealType,
        servings: meal.servings,
        prepTime: meal.prepTime,
        cookTime: meal.cookTime,
        totalTime: meal.totalTime,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        createdAt: meal.$createdAt,
        updatedAt: meal.$updatedAt,
        ingredients: ingredients.documents.map(ing => ({
          id: ing.$id,
          meal_id: ing.meal_id,
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
          category: ing.category
        } as Ingredient))
      } as MealWithIngredients;
    }));

    return mealsWithIngredients;
  } catch (error) {
    console.error('Error fetching meals:', error);
    return [];
  }
}

// Function to retrieve a single meal with its ingredients
export async function getMealWithIngredients(mealId: string): Promise<{ success: boolean, meal?: MealWithIngredients, error?: string }> {
  try {
    const meal = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_MEALS_ID!,
      mealId
    ) as Models.Document & Omit<Meal, 'id'>;

    const ingredientsResult = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_INGREDIENTS_ID!,
      [Query.equal('meal_id', mealId)]
    );

    const ingredients = ingredientsResult.documents.map(doc => ({
      id: doc.$id,
      meal_id: doc.meal_id,
      name: doc.name,
      quantity: doc.quantity,
      unit: doc.unit,
      category: doc.category
    })) as Ingredient[];

    const mealWithIngredients: MealWithIngredients = {
      id: meal.$id,
      userId: meal.userId,
      name: meal.name,
      description: meal.description,
      instructions: meal.instructions,
      nutritionalBenefits: meal.nutritionalBenefits,
      mealType: meal.mealType,
      servings: meal.servings,
      prepTime: meal.prepTime,
      cookTime: meal.cookTime,
      totalTime: meal.totalTime,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      ingredients: ingredients,
      createdAt: meal.$createdAt
    };

    return { success: true, meal: mealWithIngredients };
  } catch (error) {
    console.error('Error fetching meal with ingredients:', error);
    return { success: false, error: 'Failed to fetch meal' };
  }
}

// Function to generate a meal using AI
export async function generateMealWithAI(prompt: string, servings: number, user: User) {
  const systemPrompt = `You are a professional chef and nutritionist. Create a detailed meal based on the following prompt and number of servings. The meal should adhere to the user's dietary restrictions and preferences. Provide the meal information in the following JSON format:

{
  "name": "Meal Name",
  "description": "Brief description of the meal",
  "mealType": "breakfast|lunch|dinner|snack",
  "ingredients": [
    {"name": "Ingredient 1", "quantity": "Amount", "unit": "Unit of measurement", "category": "Ingredient category"},
    {"name": "Ingredient 2", "quantity": "Amount", "unit": "Unit of measurement", "category": "Ingredient category"}
  ],
  "instructions": [
    "Step 1 instruction",
    "Step 2 instruction"
  ],
  "nutritionalBenefits": [
    "Benefit 1",
    "Benefit 2"
  ],
  "prepTime": 0,
  "cookTime": 0,
  "totalTime": 0,
  "calories": 0,
  "protein": 0,
  "carbs": 0,
  "fat": 0
}

Ensure that the response is a valid JSON object and includes all the fields mentioned above. For the ingredient category, use one of the following: Produce, Dairy, Meat, Seafood, Bakery, Pantry, Frozen, Beverages, Spices, or Other.

User dietary information:
- Diet: ${user.diet || 'Not specified'}
- Allergies: ${user.allergies?.join(', ') || 'None'}
- Dislikes: ${user.dislikes?.join(', ') || 'None'}
- Age: ${user.age || 'Not specified'}
- Height: ${user.height || 'Not specified'} cm
- Weight: ${user.weight || 'Not specified'} kg`;

  const userPrompt = `Create a meal for ${servings} serving(s) based on: ${prompt}`;

  const ollama = createOllama({
    baseURL: process.env.NEXT_PUBLIC_OLLAMA_ENDPOINT!,
})


  try {
    console.log('Starting AI meal generation...');
    const stream = await streamText({
      model: ollama('llama3.1'),
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt },
      ],
    });

    console.log('Stream created:', stream);

    let fullResponse = '';
    const reader = stream.textStream.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      fullResponse += value;
      console.log('Received chunk:', value);
    }

    console.log('Full response:', fullResponse);

    const meal = processResponse(fullResponse);

    console.log('Generated meal:', meal);

    if (Object.values(meal).every(value => !value || (Array.isArray(value) && value.length === 0))) {
      throw new Error('AI generated an empty meal');
    }

    return { success: true, meal };
  } catch (error) {
    console.error('Error generating meal with AI:', error);
    return { success: false, error: 'Failed to generate meal with AI. Please try again.' };
  }
}

// Helper function to process the AI response
function processResponse(response: string): Omit<MealWithIngredients, 'id' | 'userId'> {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON object found in the response');
      console.log('Full response:', response);
      throw new Error('No JSON object found in the response');
    }

    let jsonString = jsonMatch[0];
    console.log('Extracted JSON string:', jsonString);

    jsonString = jsonString.replace(/"(protein|carbs|fat)":\s*(\d+)g/g, '"$1": $2');

    const mealData = JSON.parse(jsonString);
    console.log('Parsed meal data:', mealData);

    const meal: Omit<MealWithIngredients, 'id' | 'userId'> = {
      name: mealData.name || '',
      description: mealData.description || '',
      mealType: ['breakfast', 'lunch', 'dinner', 'snack'].includes(mealData.mealType) ? mealData.mealType : 'snack',
      ingredients: Array.isArray(mealData.ingredients) ? mealData.ingredients.map((ing: Partial<Ingredient>) => ({
        id: ing.id || '',
        meal_id: ing.meal_id || '',
        name: ing.name || '',
        quantity: ing.quantity || '',
        unit: ing.unit || '',
        category: ing.category || 'Other'
      })) : [],
      instructions: Array.isArray(mealData.instructions) ? mealData.instructions : [],
      nutritionalBenefits: Array.isArray(mealData.nutritionalBenefits) ? mealData.nutritionalBenefits : [],
      servings: typeof mealData.servings === 'number' ? mealData.servings : 1,
      prepTime: typeof mealData.prepTime === 'number' ? mealData.prepTime : 0,
      cookTime: typeof mealData.cookTime ===

 'number' ? mealData.cookTime : 0,
      totalTime: typeof mealData.totalTime === 'number' ? mealData.totalTime : 0,
      calories: typeof mealData.calories === 'number' ? mealData.calories : 0,
      protein: typeof mealData.protein === 'number' ? mealData.protein : 0,
      carbs: typeof mealData.carbs === 'number' ? mealData.carbs : 0,
      fat: typeof mealData.fat === 'number' ? mealData.fat : 0,
      createdAt: new Date().toISOString()
    };

    return meal;
  } catch (error) {
    console.error('Error processing AI response:', error);
    throw error;
  }
}

/*
Developer: Patrick Jakobsen
Date: 10-10-2024
*/
