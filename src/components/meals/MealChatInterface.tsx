'use client'

import { useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bot, Send, User, Loader2 } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthContext'
import { useChat } from 'ai/react'
import { toast } from 'react-hot-toast'

// MealChatInterface component: Renders the AI chat interface for meal planning assistance
export default function MealChatInterface() {
  // Ref for the scroll area to enable auto-scrolling
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  // Get the authenticated user from the AuthContext
  const { user } = useAuth()

  // If no user is authenticated, don't render the component
  if (!user) return null

  // Set up the chat functionality using the useChat hook
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    // Initialize the chat with a welcome message
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: "Hello! I'm MealBuddy, your friendly meal planning assistant. How can I help you today with meal ideas, recipes, or nutritional advice?",
      },
    ],
    // Pass the user object to the API
    body: { user },
    // Handle errors in the chat
    onError: (error) => {
      console.error('Error in chat:', error)
      toast.error('An error occurred. Please try again.')
    },
    // Keep the last message if an error occurs
    keepLastMessageOnError: true,
  })

  // Effect to auto-scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
          <CardTitle className="text-3xl font-bold text-white flex items-center">
            <Bot className="mr-2 h-8 w-8" />
            MealBuddy AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ScrollArea className="h-[500px] pr-4" ref={scrollAreaRef}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                } mb-4`}
              >
                <div
                  className={`flex items-start ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <Avatar className={message.role === 'user' ? 'ml-2' : 'mr-2'}>
                    {message.role === 'user' ? (
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    ) : (
                      <AvatarFallback>MB</AvatarFallback>
                    )}
                  </Avatar>
                  <div
                    className={`rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="flex items-center bg-gray-200 rounded-lg p-3">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <p>MealBuddy is thinking...</p>
                </div>
              </div>
            )}
          </ScrollArea>
        </CardContent>
        <CardFooter className="p-4 bg-gray-50">
          <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
            <Input
              name="prompt"
              placeholder="Ask MealBuddy about meals, recipes, or nutrition..."
              value={input}
              onChange={handleInputChange}
              className="flex-grow"
            />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}

/*
Developer: Patrick Jakobsen
Date: 10-10-2024
*/
