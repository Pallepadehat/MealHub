import { NextRequest, NextResponse } from 'next/server';
import { StreamingTextResponse, Message, streamText } from 'ai';
import { ollama } from 'ollama-ai-provider';

export const runtime = 'edge';

const model = ollama('llama2');

const SYSTEM_PROMPT = `
You are a professional nutritionist and meal planner. Create a meal plan for a user with the following preferences and restrictions:

User Information:
- Age: {age}
- Height: {height} cm
- Weight: {weight} kg
- Diet: {diet}
- Allergies: {allergies}
- Dislikes: {dislikes}

Generate a meal plan for one day, including breakfast, lunch, dinner, and two snacks. For each meal, provide:
1. The name of the dish
2. A brief description
3. Key nutritional benefits

Ensure that the meal plan adheres to the user's dietary restrictions and preferences.
`;

export async function POST(req: NextRequest) {
  const { age, height, weight, diet, allergies, dislikes } = await req.json();

  const userInfo = `
Age: ${age}
Height: ${height} cm
Weight: ${weight} kg
Diet: ${diet}
Allergies: ${allergies.join(', ')}
Dislikes: ${dislikes.join(', ')}
`;

  const response = await streamText({
   model: ollama("llama3.1"),
   system: SYSTEM_PROMPT,
   messages: [
    {role: `system`, content: SYSTEM_PROMPT},
    {role:`user`, content: userInfo}
   ]
  });

  return response.toDataStreamResponse();
}

/*
Developer: Patrick Jakobsen
Date: 09-10-2024
*/
