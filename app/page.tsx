//initial starting page for the website
import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  return (
    <>
      <Hero />
      <main className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
        {/* Centered, green heading */}
        <h2 className="text-center text-green-600 font-medium text-2xl mb-4">
          Get Started Now
        </h2>

        {/* Two buttons side by side */}
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button asChild variant="default">
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </div>

        {/* “Continue as Guest” below, in gray text */}
        <Button
          asChild
          variant="ghost"
          className="mt-2 text-gray-500"
        >
          <Link href="/guest">Continue as Guest</Link>
        </Button>
      </main>
    </>
  );
}
