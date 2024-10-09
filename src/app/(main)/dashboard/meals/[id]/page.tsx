'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMeals, Meal } from '@/hooks/useMeals';
import { useShoppingList } from '@/hooks/useShoppingList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Users, List, ArrowLeft, ShoppingCart } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Input } from '@/components/ui/input';

const MealIdPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { getMeal } = useMeals();
  const { createShoppingList, addItemToShoppingList } = useShoppingList();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [intendedDate, setIntendedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchMeal = async () => {
      if (typeof id !== 'string') return;
      try {
        const fetchedMeal = await getMeal(id);
        if (fetchedMeal) {
          setMeal(fetchedMeal);
        } else {
          toast.error('Meal not found');
        }
      } catch (error) {
        console.error('Error fetching meal:', error);
        toast.error('Failed to fetch meal');
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [id, getMeal]);

  const formatInstructions = (instructions: string) => {
    const steps = instructions.split(/\d+\./).filter(step => step.trim() !== '');
    return steps.map((step, index) => {
      const subSteps = step.split('-').filter(subStep => subStep.trim() !== '');
      return (
        <div key={index} className="mb-4">
          <h4 className="font-semibold mb-2">Step {index + 1}:</h4>
          <ul className="list-disc list-inside pl-4">
            {subSteps.map((subStep, subIndex) => (
              <li key={subIndex}>{subStep.trim()}</li>
            ))}
          </ul>
        </div>
      );
    });
  };

  const handleBack = () => {
    router.back();
  };

  const handleAddToShoppingList = async () => {
    if (!meal) return;
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

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (!meal) {
    return <div className="container mx-auto p-4">Meal not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="md:hidden mb-4">
        <Button variant="outline" size="sm" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{meal.name}</span>
            <div className="flex items-center space-x-2">
              <Input
                type="date"
                value={intendedDate}
                onChange={handleDateChange}
                className="w-40"
              />
              <Button variant="outline" size="sm" onClick={handleAddToShoppingList}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Shopping List
              </Button>
            </div>
          </CardTitle>
          <CardDescription>{meal.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Ingredients:</h3>
              <ul className="list-disc list-inside pl-4">
                {meal.ingredients.map((ingredient, index) => (
                  <li key={index}>
                    {ingredient.quantity} {ingredient.unit} {ingredient.ingredientId}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Instructions:</h3>
              <div className="pl-4">
                {formatInstructions(meal.instructions)}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap justify-between gap-4">
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            <span>Prep time: {meal.prepTime || 'N/A'}</span>
          </div>
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            <span>Servings: {meal.servings}</span>
          </div>
          <div className="flex items-center">
            <List className="mr-2 h-4 w-4" />
            <span>Total Ingredients: {meal.ingredients.length}</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MealIdPage;
