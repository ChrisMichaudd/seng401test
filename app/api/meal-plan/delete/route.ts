import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { mealId } = await req.json();
    const supabase = await createClient();

    // Delete the meal plan (trigger will handle moving it to deleted_meal_plans)
    const { error } = await supabase
      .from("meal_plans")
      .delete()
      .eq("meal_id", mealId);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting meal plan:", error);
    return NextResponse.json(
      { error: "Failed to delete meal plan" },
      { status: 500 }
    );
  }
} 