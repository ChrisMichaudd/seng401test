//landing page for authenticated users
import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CreateMealPlanButton from "@/components/AuthenticatedContinueButton";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Derive the user's name from user_metadata or default to email
  const userName = user.user_metadata?.name || user.email || "User";

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      {/* Welcome Message */}
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-4">Welcome, {userName}</h1>
      </div>
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated
          user
        </div>
      </div>
      <div>
        <div className="mt-4">
        <CreateMealPlanButton user={user} />
        </div>
      </div>
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Your user details</h2>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    </div>
  );
}
