import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function MealPlanPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Determine the greeting based on user status
  const greeting = user ? `Welcome ${user.email}` : "Welcome guest";

  return (
    <div className="flex-1 w-full flex flex-col gap-8 px-4">
      {/* Header Section */}
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-4">{greeting}</h1>
        <p className="text-muted-foreground">
          Let's create your personalized meal plan
        </p>
      </div>

      {/* Meal Plan Form Section - Placeholder for now */}
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">Your Preferences</h2>
        {/* Add your meal plan form components here */}
        <p className="text-muted-foreground">Form components will go here</p>
      </div>
    </div>
  );
}
