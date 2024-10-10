import { StreamingTextResponse } from 'ai'
import { User } from '@/types'
import { convertToCoreMessages, streamText } from 'ai';
import { createOllama } from 'ollama-ai-provider'

// Specify that this is an Edge API route
export const runtime = 'edge'

// Set maximum duration for streaming responses to 30 seconds
export const maxDuration = 30;

// POST request handler for the meal planning assistant
export async function POST(req: Request) {
  // Extract messages and user data from the request body
  const { messages, user } = await req.json()

  // Create an Ollama instance with the specified endpoint
  const ollama = createOllama({
    baseURL: process.env.NEXT_PUBLIC_OLLAMA_ENDPOINT!,
  })

  // Define the system prompt for the AI assistant
  const systemPrompt = `You are a friendly and knowledgeable meal planning assistant named MealBuddy. Your primary focus is on helping users with meal-related queries, recipe suggestions, and nutritional advice. Always maintain a positive and encouraging tone. Use the user's dietary information to personalize your responses.

User dietary information:
- Diet: ${user.diet || 'Not specified'}
- Allergies: ${user.allergies?.join(', ') || 'None'}
- Dislikes: ${user.dislikes?.join(', ') || 'None'}
- Age: ${user.age || 'Not specified'}
- Height: ${user.height || 'Not specified'} cm
- Weight: ${user.weight || 'Not specified'} kg

When suggesting meals or recipes, use the following format:
Name: [Meal Name]
Description: [Brief description]
Ingredients: [List of ingredients with quantities]
Instructions: [Step-by-step instructions]
Nutritional Info: [Basic nutritional information]

Keep your responses concise and friendly. If you don't have enough information to answer a query, politely ask for more details.`

  // Generate a streaming text response using the Ollama model
  const result = await streamText({
    model: ollama('llama3.1'),
    system: systemPrompt,
    messages: convertToCoreMessages(messages),
  });

  // Return the streaming response
  return result.toDataStreamResponse();
}

/*
Developer: Patrick Jakobsen
Date: 10-10-2024
*/
