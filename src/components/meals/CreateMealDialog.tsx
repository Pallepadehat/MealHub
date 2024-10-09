'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Wand2, Loader2, X } from "lucide-react";
import { useMeals } from "@/hooks/useMeals";
import { useIngredients } from "@/hooks/useIngredients";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-hot-toast";
import { useCompletion } from 'ai/react';

interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
  category: string;
}

export function CreateMealDialog() {
  const [open, setOpen] = useState(false);
  const [mealName, setMealName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState<Ingredient>({ name: "", quantity: "", unit: "", category: "" });
  const [instructions, setInstructions] = useState<string>("");
  const [servings, setServings] = useState<string>("");
  const [prepTime, setPrepTime] = useState<string>("");
  const [aiPrompt, setAiPrompt] = useState<string>("");
  const [isAIMode, setIsAIMode] = useState(false);
  const { addMeal } = useMeals();
  const { addIngredient } = useIngredients();
  const { user } = useAuth();

  const { complete, completion, isLoading } = useCompletion({
    api: '/api/meal-generation',
    body: { user }
  });

  useEffect(() => {
    if (completion) {
      parseAIResponse(completion);
    }
  }, [completion]);

  const parseAIResponse = (content: string) => {
    const sections = content.split(/\*\*(.*?):\*\*/);
    sections.forEach((section, index) => {
      if (section.includes("Meal Name")) {
        setMealName(sections[index + 1].trim());
      } else if (section.includes("Brief Description")) {
        setDescription(sections[index + 1].trim());
      } else if (section.includes("Ingredients")) {
        const ingredientList = sections[index + 1].trim().split('\n').map(i => {
          const [name, quantity, unit, category] = i.split(',').map(part => part.trim());
          return { name, quantity, unit, category: category || "Uncategorized" };
        });
        setIngredients(ingredientList);
      } else if (section.includes("Instructions")) {
        setInstructions(sections[index + 1].trim());
      } else if (section.includes("Servings")) {
        setServings(sections[index + 1].trim());
      } else if (section.includes("Prep Time")) {
        setPrepTime(sections[index + 1].trim());
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to create a meal');
      return;
    }
    try {
      // Add ingredients to the database
      const ingredientPromises = ingredients.map(ingredient =>
        addIngredient({
          name: ingredient.name,
          category: ingredient.category,
          userId: user.$id
        })
      );
      const addedIngredients = await Promise.all(ingredientPromises);

      // Create the meal with references to the added ingredients
      await addMeal({
        name: mealName,
        description,
        ingredients: addedIngredients.map((ing, index) => ({
          ingredientId: ing.$id,
          quantity: ingredients[index].quantity,
          unit: ingredients[index].unit
        })),
        instructions,
        userId: user.$id,
        servings,
        prepTime,
        createdAt: new Date().toISOString(),
      });
      resetForm();
      toast.success('Meal created successfully');
    } catch (error) {
      console.error('Error creating meal:', error);
      toast.error('Failed to create meal');
    }
  };

  const resetForm = () => {
    setOpen(false);
    setMealName("");
    setDescription("");
    setIngredients([]);
    setCurrentIngredient({ name: "", quantity: "", unit: "", category: "" });
    setInstructions("");
    setServings("");
    setPrepTime("");
    setAiPrompt("");
    setIsAIMode(false);
  };

  const startAIMode = () => {
    setIsAIMode(true);
  };

  const generateMeal = async () => {
    try {
      await complete(aiPrompt || 'Generate a healthy meal recipe.');
      setIsAIMode(false);
    } catch (error) {
      console.error('Error generating meal:', error);
      toast.error('Failed to generate meal');
      setIsAIMode(false);
    }
  };

  const handleAddIngredient = () => {
    if (currentIngredient.name.trim() !== '') {
      setIngredients([...ingredients, { ...currentIngredient, category: currentIngredient.category || "Uncategorized" }]);
      setCurrentIngredient({ name: "", quantity: "", unit: "", category: "" });
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const renderFields = () => {
    if (isAIMode) {
      return (
        <div className="grid gap-4">
          <Label htmlFor="ai-prompt">AI Prompt</Label>
          <Textarea
            id="ai-prompt"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Enter AI prompt (e.g., 'Generate a keto-friendly dinner recipe')"
            className="h-24"
          />
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
            placeholder="Enter meal name"
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter meal description"
            required
          />
        </div>
        <div>
          <Label htmlFor="ingredients">Ingredients</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {ingredients.map((ingredient, index) => (
              <Badge key={index} variant="secondary">
                {ingredient.quantity} {ingredient.unit} {ingredient.name} ({ingredient.category})
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-4 w-4 p-0"
                  onClick={() => removeIngredient(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Ingredient name"
              value={currentIngredient.name}
              onChange={(e) => setCurrentIngredient({...currentIngredient, name: e.target.value})}
            />
            <Input
              placeholder="Quantity"
              value={currentIngredient.quantity}
              onChange={(e) => setCurrentIngredient({...currentIngredient, quantity: e.target.value})}
            />
            <Input
              placeholder="Unit"
              value={currentIngredient.unit}
              onChange={(e) => setCurrentIngredient({...currentIngredient, unit: e.target.value})}
            />
            <Input
              placeholder="Category"
              value={currentIngredient.category}
              onChange={(e) => setCurrentIngredient({...currentIngredient, category: e.target.value})}
            />
          </div>
          <Button type="button" onClick={handleAddIngredient} className="mt-2">
            Add Ingredient
          </Button>
        </div>
        <div>
          <Label htmlFor="instructions">Instructions</Label>
          <Textarea
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Enter cooking instructions"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="servings">Servings</Label>
            <Input
              id="servings"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              placeholder="Number of servings"
              required
            />
          </div>
          <div>
            <Label htmlFor="prepTime">Prep Time</Label>
            <Input
              id="prepTime"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              placeholder="Preparation time"
              required
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Meal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Meal</DialogTitle>
            <DialogDescription>
              {isAIMode
                ? "Enter a prompt to generate a meal, then click generate."
                : "Add a new meal to your collection. Click save when you're done."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {renderFields()}
          </div>
          <DialogFooter>
            {!isAIMode && (
              <Button type="button" variant="outline" onClick={startAIMode}>
                <Wand2 className="mr-2 h-4 w-4" />
                Use AI
              </Button>
            )}

            {isAIMode && (
              <Button type="button" onClick={generateMeal} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Meal
                  </>
                )}
              </Button>
            )}
            {!isAIMode && <Button type="submit">Save Meal</Button>}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
