'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMeals, Meal } from '@/hooks/useMeals';
import { useShoppingList } from '@/hooks/useShoppingList';
import { CreateMealDialog } from '@/components/meals/CreateMealDialog';
import { FloatingChatBot } from '@/components/FloatingChatBot';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Users, Trash2, List, ShoppingCart, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function MealsPage() {
  const { getMeals, deleteMeal } = useMeals();
  const { createShoppingList, addItemToShoppingList } = useShoppingList();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [intendedDate, setIntendedDate] = useState(new Date().toISOString().split('T')[0]);
  const router = useRouter();

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const fetchedMeals = await getMeals();
        setMeals(fetchedMeals);
      } catch (error) {
        console.error('Error fetching meals:', error);
        toast.error('Failed to fetch meals');
      }
    };

    fetchMeals();
  }, [getMeals]);

  const handleMealClick = (id: string) => {
    router.push(`/dashboard/meals/${id}`);
  };

  const handleDeleteMeal = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await deleteMeal(id);
      setMeals(meals.filter(meal => meal.$id !== id));
      toast.success('Meal deleted successfully');
    } catch (error) {
      console.error('Error deleting meal:', error);
      toast.error('Failed to delete meal');
    }
  };

  const handleAddToShoppingList = async (e: React.MouseEvent, meal: Meal) => {
    e.stopPropagation();
    try {
      // Create a new shopping list
      const shoppingListId = await createShoppingList(meal.name, intendedDate);
      if (!shoppingListId) {
        throw new Error('Failed to create shopping list');
      }

      // Add items to the shopping list
      const addItemPromises = meal.ingredients.map(ing =>
        addItemToShoppingList(shoppingListId, {
          ingredientId: ing.ingredientId,
          quantity: ing.quantity,
          category: 'Uncategorized', // You might want to add a category to your Ingredient type
          inBasket: false,
          shoppingListId: shoppingListId
        })
      );

      await Promise.all(addItemPromises);
      toast.success('Ingredients added to shopping list');
    } catch (error) {
      console.error('Error adding ingredients to shopping list:', error);
      toast.error('Failed to add ingredients to shopping list');
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIntendedDate(e.target.value);
  };

  return (
    <div className="container mx-auto p-4 space-y-6 pb-12">
      <h1 className="text-2xl font-bold mb-4">Your Meals</h1>
      <CreateMealDialog />
      <div className="flex justify-end mb-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Set Shopping List Date
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Shopping List Date</h4>
                <p className="text-sm text-muted-foreground">
                  Set the date for adding ingredients to the shopping list.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Input
                    id="intended-date"
                    type="date"
                    value={intendedDate}
                    onChange={handleDateChange}
                    className="col-span-2 h-8"
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {meals.map((meal) => (
          <Card
            key={meal.$id}
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => handleMealClick(meal.$id)}
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{meal.name}</span>
                <div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="mr-2"
                    onClick={(e) => handleAddToShoppingList(e, meal)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={(e) => handleDeleteMeal(e, meal.$id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>{meal.description}</CardDescription>
            </CardHeader>
            <CardFooter className="grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <span>Prep: {meal.prepTime || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                <span>Servings: {meal.servings}</span>
              </div>
              <div className="flex items-center">
                <List className="mr-2 h-4 w-4" />
                <span>Ingredients: {meal.ingredients.length}</span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      <FloatingChatBot />
    </div>
  );
}
