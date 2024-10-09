import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface MealPlannerUpdateProps {
  meal: string;
  date: string;
}

export function MealPlannerUpdate({ meal, date }: MealPlannerUpdateProps) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Added to Meal Planner</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{new Date(date).toLocaleDateString()} - {meal}</span>
        </div>
      </CardContent>
    </Card>
  );
}
