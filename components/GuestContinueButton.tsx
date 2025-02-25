"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";

export default function GuestContinueButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleContinueAsGuest = async () => {
    // Insert a row where user_email & name are null
    const { data, error } = await supabase
      .from("meal_plans")
      .insert([{}])  // Wrap empty object in array
      .select()
      .single();

    if (error) {
      console.error("Error creating guest meal plan:", error);
      return;
    }

    // The new meal plan row
    const newMealPlan = data;
    // e.g. "52c6c5cf-7b0e-43eb-9f8f-04e882a5b15a"
    const mealId = newMealPlan.meal_id;

    // Redirect to /meal-plan/[mealId]
    router.push(`/meal-plan/${mealId}`);
  };

  return (
    <Button 
      variant="ghost" 
      className="mt-2 text-gray-500"
      onClick={handleContinueAsGuest}
    >
      Continue as Guest
    </Button>
  );
}
