import Hero from "@/components/hero";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import GuestContinueButton from "@/components/GuestContinueButton";
import Image from "next/image";
import prepSmartLogo from "@/components/prepsmartlogos/PrepSmartLogoAllWhite.png";

export default async function Home() {
  return (
    <>
      <Hero />
      <main className="flex flex-col items-center justify-start w-full px-4 space-y-4 sm:space-y-6 mt-[-25px] sm:mt-[-50px]">
        <div className="flex flex-col items-center space-y-2 w-[90vw] sm:w-auto mx-auto">
          <Image 
            src={prepSmartLogo} 
            alt="PrepSmart Logo" 
            width={100} 
            height={100}
            className="w-[100px] sm:w-[150px] h-auto"
          />
        </div>

        <h2 className="text-center text-primary font-semibold text-2xl sm:text-3xl w-[90vw] sm:w-auto mx-auto">
          Get Started Now!
        </h2>

        <div className="flex gap-2 w-[90vw] sm:w-auto mx-auto justify-center">
          <Button asChild variant="outline">
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button asChild variant="default">
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </div>

        <div className="w-[90vw] sm:w-auto mx-auto flex justify-center">
          <GuestContinueButton />
        </div>
      </main>
    </>
  );
}
