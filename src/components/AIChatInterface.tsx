'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Send } from 'lucide-react';
import { ShoppingListUpdate } from '@/components/shopping-lists/ShoppingListUpdate';
import { SuggestedItemsList } from '@/components/SuggestedItemsList';
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from './ui/badge';

interface ShoppingListItem {
  name: string;
  quantity: string;
}

export function AIChatInterface() {
  const { user } = useAuth();
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: '/api/chat',
    body: { user }
  });

  const [shoppingListItems, setShoppingListItems] = useState<ShoppingListItem[]>([]);
  const [suggestedItems, setSuggestedItems] = useState<ShoppingListItem[]>([]);
  const [isSuggestingItems, setIsSuggestingItems] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, suggestedItems, shoppingListItems]);

  useEffect(() => {
    const handleStreamingData = (message: string) => {
      if (message.includes('ADD_TO_SHOPPING_LIST:')) {
        setIsSuggestingItems(true);
        const itemsString = message.split('ADD_TO_SHOPPING_LIST:')[1];
        const items = itemsString.split(',').map(item => {
          const parts = item.split('(');
          const name = parts[0].trim();
          const quantity = parts[1] ? parts[1].replace(')', '').trim() : 'as needed';
          return { name, quantity };
        });
        setSuggestedItems(items);
        setIsSuggestingItems(false);
      }
      scrollToBottom();
    };

    messages.forEach(message => {
      if (message.role === 'assistant') {
        handleStreamingData(message.content);
      }
    });
  }, [messages]);

  const addToShoppingList = (item: ShoppingListItem) => {
    setShoppingListItems(prevItems => [...prevItems, item]);
    setSuggestedItems(prevItems => prevItems.filter(i => i.name !== item.name));
  };

  const formatMessage = (content: string): string => {
    let formattedContent = content;

    // Remove ADD_TO_MEAL_PLANNER command
    formattedContent = formattedContent.replace(/ADD_TO_MEAL_PLANNER:[^\n]+\n?/g, '');

    // Remove ADD_TO_SHOPPING_LIST command and its content
    formattedContent = formattedContent.replace(/ADD_TO_SHOPPING_LIST:[\s\S]*?(?:\n\n|$)/, '');

    // Remove any trailing newlines and "**" that might be left
    formattedContent = formattedContent.replace(/\n+\*\*\s*$/, '');

    return formattedContent.trim();
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuggestedItems([]); // Hide suggested items when sending a new message
    await handleSubmit(e);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-none rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold">AI Meal Planner Assistant</h1>
          <Badge variant="secondary" className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
            Beta
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4" ref={scrollAreaRef}>
          <div className="min-h-full flex-1 flex flex-col justify-end gap-4 w-full pb-4">
            <AnimatePresence>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`w-full flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <Avatar className="w-8 h-8 mt-1">
                      <AvatarFallback>{m.role === 'user' ? 'U' : 'AI'}</AvatarFallback>
                    </Avatar>
                    <div className={`mx-2 p-3 rounded-lg ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                      {m.role === 'assistant' ? (
                        <ReactMarkdown className="prose prose-sm dark:prose-invert">
                          {formatMessage(m.content)}
                        </ReactMarkdown>
                      ) : (
                        m.content
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {suggestedItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <SuggestedItemsList items={suggestedItems} onAddItem={addToShoppingList} isLoading={isSuggestingItems} />
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {shoppingListItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ShoppingListUpdate items={shoppingListItems} />
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </ScrollArea>
      </CardContent>
      <CardFooter className='flex flex-col items-start'>
        <form onSubmit={handleFormSubmit} className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="Ask about meal planning, shopping lists, or recipes..."
            value={input}
            onChange={handleInputChange}
            className="flex-grow"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
        <p className='text-xs text-muted-foreground ml-1 mt-2'>Meal Planner Assistant can make mistakes. Use with caution.</p>
      </CardFooter>
    </Card>
  );
}
