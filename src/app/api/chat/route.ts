import { createOllama } from "ollama-ai-provider";
import { streamText } from "ai";

const ollama = createOllama();

export const runtime = "edge";

interface User {
  name: string;
  email: string;
  dietType?: string;
  allergies?: string[];
  cookingExperience?: string;
  mealPlanningGoals?: string;
}

export async function POST(req: Request) {
  const { messages, user } = await req.json();

  const systemPrompt = `You are an AI assistant for MealHub, a meal planning and grocery list application. Your role is to help users plan meals, create shopping lists, and provide recipe suggestions. When adding items to a shopping list, use the format 'ADD_TO_SHOPPING_LIST:item1 (quantity1),item2 (quantity2),item3 (quantity3)'. Always include specific quantities (e.g., grams, ml, pieces) for each item. When adding a meal to the meal planner, use the format 'ADD_TO_MEAL_PLANNER:meal|date'. Always be helpful, concise, and focused on meal planning and nutrition.

User Information:
Name: ${user?.name || 'Unknown'}
Diet Type: ${user?.dietType || 'Not specified'}
Allergies: ${user?.allergies?.join(', ') || 'None'}
Cooking Experience: ${user?.cookingExperience || 'Not specified'}
Meal Planning Goals: ${user?.mealPlanningGoals || 'Not specified'}

Please tailor your responses to the user's specific dietary needs, allergies, cooking experience, and meal planning goals.`;

  const result = await streamText({
    model: ollama("llama3.1"),
    system: systemPrompt,
    messages,
    temperature: 0.7,
    maxTokens: 500,
  });
  return result.toDataStreamResponse();
}
