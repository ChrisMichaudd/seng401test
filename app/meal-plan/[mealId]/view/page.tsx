import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import MealPlanDisplay from './MealPlanDisplay';
import type { MealPlanData } from './types';

export default async function MealPlanView({ params }: { params: { mealId: string } }) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("meal_plans")
    .select("*")
    .eq("meal_id", params.mealId)
    .single();

  if (error || !data || !data.ai_return) {
    return notFound();
  }

  return <MealPlanDisplay mealPlan={data.ai_return as MealPlanData} />;
} 