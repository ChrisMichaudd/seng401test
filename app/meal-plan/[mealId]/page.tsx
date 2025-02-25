import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import MealPlanFormClient from "./MealPlanFormClient"; // <-- We'll create this client component
export const dynamic = "force-dynamic";


interface MealPlanPageProps {
  params: { mealId: string };
}

export default async function MealPlanPage({ params }: MealPlanPageProps) {
  const { mealId } = params;  // Simple destructuring is correct - no await needed
  const supabase = await createClient();
  
  // Fetch the row for this mealId
  const { data, error } = await supabase
    .from("meal_plans")
    .select("*")
    .eq("meal_id", mealId)
    .single();

  if (error || !data) {
    console.error(error);
    // Could use `notFound()` or handle error differently
    return notFound();
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8 px-4 py-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">
          {data.user_email ? `Welcome back, ${data.user_email}!` : "Welcome to Your Meal Planning Session!"}
        </h1>
        <p className="text-gray-600 mb-8">
          Let's create a personalized meal plan that fits your needs and preferences.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 text-black">Getting Started</h2>
        <p className="text-gray-700 mb-4">
          Tell us about your dietary preferences and requirements, and we'll help you generate 
          a customized meal plan that works for you.
        </p>
        
        {/* 
          Render our client-side form component, 
          passing the existing meal plan data and the mealId 
        */}
        <MealPlanFormClient mealId={mealId} initialData={data} />
      </div>

      {/* For development purposes only - can be removed in production */}
      <div className="text-sm text-gray-400 text-center">
        Session ID: {mealId}
      </div>
    </div>
  );
}
