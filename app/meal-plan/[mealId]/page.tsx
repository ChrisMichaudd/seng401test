import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import MealPlanFormClient from "./MealPlanFormClient"; // <-- We'll create this client component
export const dynamic = "force-dynamic";


interface MealPlanPageProps {
  params: Promise<{ mealId: string }>;
}

export default async function MealPlanPage(props: MealPlanPageProps) {
  const params = await props.params;
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
    <div className="min-h-screen w-full flex flex-col items-center -mx-4 sm:mx-0">
      <div className="w-full max-w-[92vw] sm:max-w-4xl flex flex-col gap-4 sm:gap-6 py-4 sm:py-6 mx-auto">
        <div className="w-[90vw] sm:w-full text-center mx-auto">
          <h1 className="text-xl sm:text-3xl font-bold mb-2 break-words">
            {data.user_email ? `Welcome back, ${data.user_email}!` : "Welcome to Your Meal Planning Session!"}
          </h1>
          <p className="text-gray-300 mb-4 sm:mb-8 text-sm sm:text-base">
            Let's create a personalized meal plan that fits your needs and preferences.
          </p>
        </div>

        <div className="w-[90vw] sm:w-full bg-white p-3 sm:p-6 rounded-lg shadow-sm border mx-auto">
          <h2 className="text-base sm:text-xl font-semibold mb-2 sm:mb-4 text-black">
            Getting Started
          </h2>
          <p className="text-gray-700 mb-4 text-sm sm:text-base">
            Tell us about your dietary preferences and requirements, and we'll help you generate 
            a customized meal plan that works for you.
          </p>
          
          <MealPlanFormClient mealId={mealId} initialData={data} />
        </div>

        <div className="w-[90vw] sm:w-full text-xs sm:text-sm text-gray-400 text-center mx-auto">
          Session ID: {mealId}
        </div>
      </div>
    </div>
  );
}
