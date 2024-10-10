export interface User {
    id: string;
    name: string;
    email: string;
    onboardingCompleted?: boolean;
    age?: number;
    height?: number;
    weight?: number;
    diet?: string;
    allergies?: string[];
    dislikes?: string[];
  }

  export interface OnboardingData {
    age: number;
    height: number;
    weight: number;
    diet: string;
    allergies: string[];
    dislikes: string[];
  }

  export interface Ingredient {
    id: string;
    meal_id: string;
    name: string;
    quantity: string;
    unit: string;
  }

  export interface Meal {
    id: string;
    userId: string;
    name: string;
    description: string;
    instructions: string[];
    nutritionalBenefits: string[];
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    servings: number;
    prepTime: number;
    cookTime: number;
    totalTime: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    createdAt: string; // Add this line
  }

  export interface Ingredient {
    id: string;
    meal_id: string;
    name: string;
    quantity: string;
    unit: string;
  }


  export interface MealWithIngredients extends Meal {
    ingredients: Ingredient[];
  }

  /*
  Developer: Patrick Jakobsen
  Date: 09-10-2024
  */
