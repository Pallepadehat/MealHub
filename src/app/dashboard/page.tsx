import MealChatInterface from '@/components/meals/MealChatInterface'

// MealChatPage component: Renders the meal chat interface
export default function MealChatPage() {
  // The component simply renders the MealChatInterface component
  // This pattern is useful for keeping the page component simple
  // and delegating the main functionality to a separate component
  return <MealChatInterface />
}

/*
Developer: Patrick Jakobsen
Date: 10-10-2024
*/
