// User interface represents the structure of a user in the MealHub application
export interface User {
    id: string;                  // Unique identifier for the user
    name: string;                // User's name
    email: string;               // User's email address
    onboardingCompleted?: boolean; // Whether the user has completed the onboarding process
    age?: number;                // User's age (optional)
    height?: number;             // User's height (optional)
    weight?: number;             // User's weight (optional)
    diet?: string;               // User's dietary preference (optional)
    allergies?: string[];        // List of user's allergies (optional)
    dislikes?: string[];         // List of foods the user dislikes (optional)
  }

  // OnboardingData interface represents the data collected during the onboarding process
  export interface OnboardingData {
    age: number;                 // User's age
    height: number;              // User's height
    weight: number;              // User's weight
    diet: string;                // User's dietary preference
    allergies: string[];         // List of user's allergies
    dislikes: string[];          // List of foods the user dislikes
  }

  // Ingredient interface represents the structure of an ingredient in a meal
  export interface Ingredient {
    id: string;                  // Unique identifier for the ingredient
    meal_id: string;             // ID of the meal this ingredient belongs to
    name: string;                // Name of the ingredient
    quantity: string;            // Quantity of the ingredient
    unit: string;                // Unit of measurement for the ingredient
    category: string;            // Category of the ingredient (e.g., produce, dairy, meat)
  }

  // Meal interface represents the structure of a meal in the MealHub application
  export interface Meal {
    id: string;                  // Unique identifier for the meal
    userId: string;              // ID of the user who created the meal
    name: string;                // Name of the meal
    description: string;         // Description of the meal
    instructions: string[];      // List of instructions for preparing the meal
    nutritionalBenefits: string[]; // List of nutritional benefits of the meal
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'; // Type of meal
    servings: number;            // Number of servings the meal provides
    prepTime: number;            // Preparation time in minutes
    cookTime: number;            // Cooking time in minutes
    totalTime: number;           // Total time to prepare and cook the meal
    calories: number;            // Number of calories per serving
    protein: number;             // Amount of protein per serving
    carbs: number;               // Amount of carbohydrates per serving
    fat: number;                 // Amount of fat per serving
    createdAt: string;           // Timestamp of when the meal was created
  }

  // MealWithIngredients interface extends Meal to include the list of ingredients
  export interface MealWithIngredients extends Meal {
    ingredients: Ingredient[];   // List of ingredients used in the meal
  }

  /*
  Developer: Patrick Jakobsen
  Date: 10-10-2024
  */
