export interface MealType {
  name: string;
  ingredients: string[];
  calories: number;
  protein: number;
  instructions: string[];
  estimatedCost: number;
}

export interface WeeklyMealPlan {
  breakfast: MealType[];
  lunch: MealType[];
  dinner: MealType[];
}

export interface GroceryItem {
  name: string;
  quantity: string;
  estimatedPrice: number;
}

export interface GroceryCategory {
  category: string;
  items: GroceryItem[];
}

export interface MealPlanData {
  weeklyMealPlan: WeeklyMealPlan;
  groceryList: GroceryCategory[];
  totalWeeklyCost: number;
  nutritionSummary: {
    averageDailyCalories: number;
    averageDailyProtein: number;
  };
} 