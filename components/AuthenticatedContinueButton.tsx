"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";

export default function CreateMealPlanButton({ user }: { user: any }) {
  const router = useRouter();
  const supabase = createClient();

  const handleCreateMealPlan = async () => {
    // Possibly read from user object
    const email = user.email;
    const name = user.user_metadata?.name || null;

    // Insert a row with user_email and name
    const { data, error } = await supabase
      .from("meal_plans")
      .insert([{
        user_email: email,
        name: name,
      }])
      .select()
      .single();

    if (error) {
      console.error("Error creating meal plan:", error);
      return;
    }

    // The new meal plan
    const newMealPlan = data;
    // e.g. "52c6c5cf-7b0e-43eb-9f8f-04e882a5b15a"
    const mealId = newMealPlan.meal_id;

    // Redirect to /meal-plan/[mealId]
    router.push(`/meal-plan/${mealId}`);
  };

  return (
    <Button onClick={handleCreateMealPlan} variant="default">
      Create Meal Plan
    </Button>
  );
}
