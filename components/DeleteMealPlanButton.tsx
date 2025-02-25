"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function DeleteMealPlanButton({ mealId }: { mealId: string }) {
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this meal plan?')) {
      const response = await fetch(`/api/meal-plan/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mealId }),
      });

      if (response.ok) {
        window.location.reload();
      }
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm"
      className="flex items-center justify-center w-10 bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
      onClick={handleDelete}
      title="Delete meal plan"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
} 