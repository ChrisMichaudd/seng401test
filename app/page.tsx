//initial starting page for the website
import Hero from "@/components/hero";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import GuestContinueButton from "@/components/GuestContinueButton";

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

        {/*Continue as Guest Button*/}
        <GuestContinueButton />
      </main>
    </>
  );
}
