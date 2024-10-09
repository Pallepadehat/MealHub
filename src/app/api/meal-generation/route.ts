import { createOllama } from "ollama-ai-provider";
import { streamText } from "ai";

const ollama = createOllama();

export const runtime = "edge";

export async function POST(req: Request) {
  const { prompt, user } = await req.json();

  const systemPrompt = `You are an AI assistant for MealHub, specializing in meal generation. Your task is to create detailed meal recipes based on user preferences and dietary requirements. For each meal, provide the following information in a structured format:

  **Meal Name:**
  [Provide the name of the meal]

  **Brief Description:**
  [Provide a short description of the meal]

  **Ingredients (with quantities):**
  [List each ingredient followed by its quantity, one per line]

  **Instructions:**
  [Provide step-by-step instructions for preparing the meal]

  **Servings:**
  [Specify the number of servings]

  **Prep Time:**
  [Specify the preparation time in minutes]

  **User Information:**
  Name: ${user?.name || 'Unknown'}
  Diet Type: ${user?.dietType || 'Not specified'}
  Allergies: ${user?.allergies?.join(', ') || 'None'}
  Cooking Experience: ${user?.cookingExperience || 'Not specified'}
  Meal Planning Goals: ${user?.mealPlanningGoals || 'Not specified'}

  Please tailor your meal suggestions to the user's specific dietary needs, allergies, cooking experience, and meal planning goals. Ensure that all ingredients and instructions are clear and easy to follow. Provide your response in the exact format specified above, including the bold headings.`;

  try {
    const result = await streamText({
      model: ollama("llama2"),
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      maxTokens: 1000,
    });

    return result.toDataStreamResponse();

  } catch (error) {
    console.error('Error in AI processing:', error);
    return new Response('Error processing request', { status: 500 });
  }
}
