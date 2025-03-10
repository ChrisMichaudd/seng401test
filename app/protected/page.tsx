//landing page for authenticated users
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CreateMealPlanButton from "@/components/AuthenticatedContinueButton";
import { Eye, Edit2, Clock } from "lucide-react";
import DeleteMealPlanButton from "@/components/DeleteMealPlanButton";

interface MealPlan {
  meal_id: string;
  created_at: string;
  ai_return: any;
  // Add other relevant fields
}

// Helper function to format date and time
function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch user's meal plans
  const { data: mealPlans, error } = await supabase
    .from("meal_plans")
    .select("*")
    .eq("user_email", user.email)
    .order('created_at', { ascending: false });

  // Derive the user's name from user_metadata or default to email
  const userName = user.user_metadata?.name || user.email || "User";

  return (
    <div className="flex-1 w-full flex flex-col gap-8 items-center p-4">
      {/* Welcome Message */}
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-4 break-words">{`Welcome, ${userName}!`}</h1>
      </div>

      {/* Create New Meal Plan Button */}
      <div className="w-full max-w-4xl flex justify-center">
        <CreateMealPlanButton user={user} />
      </div>

      {/* Updated Meal Plans List */}
      <div className="w-full max-w-4xl">
        <h2 className="text-xl font-semibold mb-4">Your Existing Meal Plans</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="max-h-[500px] overflow-y-auto">
            {mealPlans && mealPlans.length > 0 ? (
              <div className="w-full">
                {/* Desktop view */}
                <table className="w-full hidden md:table">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mealPlans.map((plan: MealPlan) => {
                      const { date, time } = formatDateTime(plan.created_at);
                      return (
                        <tr key={plan.meal_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>{date}</div>
                            <div className="text-xs text-gray-400">{time}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              plan.ai_return 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {plan.ai_return ? (
                                <>
                                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                                  Generated
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3 h-3" />
                                  Pending
                                </>
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex gap-2 justify-end">
                              {/* View button placeholder/real button */}
                              <div className="w-[72px]">
                                {plan.ai_return ? (
                                  <Link href={`/meal-plan/${plan.meal_id}/view`}>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="flex items-center gap-1 w-full"
                                    >
                                      <Eye className="w-4 h-4" />
                                      View
                                    </Button>
                                  </Link>
                                ) : null}
                              </div>
                              {/* Edit button - always present */}
                              <Link href={`/meal-plan/${plan.meal_id}`}>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="flex items-center gap-1 w-[72px]"
                                >
                                  <Edit2 className="w-4 h-4" />
                                  Edit
                                </Button>
                              </Link>
                              {/* Delete button */}
                              <DeleteMealPlanButton mealId={plan.meal_id} />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Mobile view */}
                <div className="md:hidden">
                  {mealPlans.map((plan: MealPlan) => {
                    const { date, time } = formatDateTime(plan.created_at);
                    return (
                      <div key={plan.meal_id} className="p-4 border-b border-gray-200">
                        <div className="flex flex-col space-y-3">
                          {/* Date and Time */}
                          <div className="text-sm text-gray-500">
                            <div>{date}</div>
                            <div className="text-xs text-gray-400">{time}</div>
                          </div>
                          
                          {/* Status */}
                          <div>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              plan.ai_return 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {plan.ai_return ? (
                                <>
                                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                                  Generated
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3 h-3" />
                                  Pending
                                </>
                              )}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            {/* View button */}
                            {plan.ai_return && (
                              <Link href={`/meal-plan/${plan.meal_id}/view`} className="flex-1">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="flex items-center gap-1 w-full justify-center"
                                >
                                  <Eye className="w-4 h-4" />
                                  View
                                </Button>
                              </Link>
                            )}
                            
                            {/* Edit button */}
                            <Link href={`/meal-plan/${plan.meal_id}`} className="flex-1">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex items-center gap-1 w-full justify-center"
                              >
                                <Edit2 className="w-4 h-4" />
                                Edit
                              </Button>
                            </Link>
                            
                            {/* Delete button */}
                            <div className="flex-1">
                              <DeleteMealPlanButton mealId={plan.meal_id} />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No meal plans created yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
